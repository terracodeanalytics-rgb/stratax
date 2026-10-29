"""Bounded acoustic worker dispatcher; called by admitted jobs, never API requests."""
import numpy as np
from seismic_processing import require


def execute_acoustic(configuration, observed=None, *, cancelled=lambda:False,
                     checkpoint=lambda value:None, resumed=None):
    from seismic_acoustic import AcousticSession
    from seismic_rtm_work import AcousticSurvey, rtm_survey, run_multiscale_fwi
    require(configuration.get("referencesConfirmed") is True,
            "Review acquisition geometry, interval velocity, TWT and source assumptions.")
    velocity = np.asarray(configuration["velocity"], float)
    shots = configuration["shots"]
    require(isinstance(shots, list) and 1 <= len(shots) <= 1000, "Provide reviewed bounded shot geometry.")
    sessions = []
    for shot in shots:
        sessions.append(AcousticSession(velocity, configuration["spacing"], configuration["origin"],
            shot["source"], shot["receivers"], dt=configuration["dt"], end_seconds=configuration["endSeconds"],
            frequency_hz=configuration["frequencyHz"], maximum_velocity=configuration["maximumVelocity"],
            nbl=configuration.get("boundaryCells",20), space_order=configuration.get("spaceOrder",4),
            maximum_saved_bytes=configuration["maximumSavedBytes"]))
    operation = configuration["operation"]
    if operation == "model":
        records = []
        for index, session in enumerate(sessions):
            require(not cancelled(), "Acoustic modelling cancelled between shots.")
            data,_ = session.forward(); records.append(data)
            checkpoint(dict(completedShots=index+1))
        return dict(records=records, provenance=[s.provenance for s in sessions])
    require(isinstance(observed, list) and len(observed) == len(sessions), "Provide actual shot observations in geometry order.")
    if operation == "rtm":
        require(resumed is None, "RTM shot checkpoint restoration must be admitted by the worker before dispatch.")
        return rtm_survey(sessions, observed, cancelled=cancelled, checkpoint=checkpoint)
    if operation == "fwi":
        survey = AcousticSurvey(sessions)
        return run_multiscale_fwi(survey, np.concatenate([np.asarray(a,float) for a in observed]), configuration["plan"],
            max_update_fraction=configuration.get("maximumUpdateFraction",.05), cancelled=cancelled,
            checkpoint=checkpoint, resumed=resumed)
    raise ValueError("Choose model, rtm or fwi.")
