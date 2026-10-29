"""Well-held-out calibrated seismic property/facies prediction."""
import numpy as np
from seismic_processing import require


def calibrated_prediction(features, targets, well_ids, prediction_features, *, blind_wells,
                          feature_names, target_unit, task, seed=42, trees=100):
    x, y, wells, prediction = (np.asarray(a) for a in (features, targets, well_ids, prediction_features))
    x, prediction, y = x.astype(float), prediction.astype(float), y.astype(float)
    require(x.ndim == prediction.ndim == 2 and 1 <= x.shape[1] <= 128 and prediction.shape[1] == x.shape[1],
            "Provide matching calibrated feature columns for conditioning and prediction.")
    require(10 <= len(x) <= 20000 and 1 <= len(prediction) <= 20000 and y.shape == wells.shape == (len(x),),
            "Provide 10–20000 well-labelled conditioning rows and bounded predictions.")
    require(all(np.all(np.isfinite(a)) for a in (x, y, prediction)), "Resolve missing calibrated feature/target values.")
    require(isinstance(feature_names, list) and len(feature_names) == x.shape[1]
            and len(set(feature_names)) == len(feature_names), "Declare distinct feature identities in column order.")
    require(isinstance(target_unit, str) and target_unit.strip(), "Declare target units/categories and calibration.")
    require(isinstance(blind_wells, list) and blind_wells and set(blind_wells) <= set(wells),
            "Select actual held-out wells; random depth-row splits do not qualify as blind-well validation.")
    test = np.isin(wells, blind_wells); training = ~test
    require(training.sum() >= 5 and test.sum() >= 3 and len(set(wells[training])) >= 1,
            "Separate conditioning wells and blind wells with sufficient samples.")
    require(task in ("regression", "classification") and type(seed) is int and 0 <= seed <= 2**32-1
            and type(trees) is int and 10 <= trees <= 500, "Review task, reproducible seed and 10–500 trees.")
    from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
    cls = RandomForestRegressor if task == "regression" else RandomForestClassifier
    engine = cls(n_estimators=trees, random_state=seed, n_jobs=1, min_samples_leaf=2)
    engine.fit(x[training], y[training]); held_out = engine.predict(x[test])
    predicted = engine.predict(prediction)
    if task == "regression":
        residual = held_out - y[test]
        validation = dict(rmse=float(np.sqrt(np.mean(residual**2))), bias=float(np.mean(residual)),
                          mae=float(np.mean(np.abs(residual))))
        per_tree = np.asarray([tree.predict(prediction) for tree in engine.estimators_])
        uncertainty = dict(ensembleStd=per_tree.std(axis=0), interpretation="tree disagreement, not calibrated predictive probability")
    else:
        validation = dict(accuracy=float(np.mean(held_out == y[test])),
                          unseenBlindCategories=np.setdiff1d(np.unique(y[test]), engine.classes_).tolist())
        uncertainty = dict(probabilities=engine.predict_proba(prediction), categories=engine.classes_,
                           interpretation="forest vote probabilities; external calibration remains required")
    return dict(prediction=predicted, blindPrediction=held_out, blindObserved=y[test], blindWells=blind_wells,
                trainingWells=sorted(set(wells[training].tolist())), validation=validation,
                featureImportance=engine.feature_importances_, features=feature_names, targetUnit=target_unit,
                uncertainty=uncertainty, extrapolation=np.any((prediction < x[training].min(axis=0))
                    | (prediction > x[training].max(axis=0)), axis=1), seed=seed, trees=trees)
