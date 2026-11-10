// Draft form values are project-scoped metadata; no sampled data is duplicated.
export function bindingKey(binding={}){return JSON.stringify(Object.fromEntries(['datasetId','columnId','stepId','output','unit'].filter(key=>binding[key]!==undefined&&binding[key]!==null).map(key=>[key,binding[key]])));}

export function captureWorkflowFields(form){
 return [...form.querySelectorAll('[data-step]')].map(row=>({id:row.dataset.step,fields:[...row.querySelectorAll('input,select,textarea')].map(input=>{
  const parameter=input.closest('[data-step-parameter]');let selector;
  if(parameter)selector=`[data-step-parameter="${CSS.escape(parameter.dataset.stepParameter)}"] `+(input.hasAttribute('data-override')?'[data-override]':'[data-value]');
  else{const attr=['data-binding-role','data-confirm-role','data-basis-role','data-checkpoint','data-zone','data-publish','data-step-reviewed'].find(key=>input.hasAttribute(key));if(!attr)return null;selector=`[${attr}="${CSS.escape(input.getAttribute(attr))}"]`;}
  return {selector,value:input.value,checked:input.checked};
 }).filter(Boolean)}));
}

export function restoreWorkflowFields(form,rows=[]){
 for(const row of rows){const target=form.querySelector(`[data-step="${CSS.escape(row.id)}"]`);if(!target)continue;for(const field of row.fields){const input=target.querySelector(field.selector);if(!input)continue;if(input.type==='checkbox')input.checked=field.checked;else input.value=field.value;}}
}

export function importWorkflowDefinition(value,projectId){
 if(value?.definition){if(value.projectId&&value.projectId!==projectId)throw new Error('This definition belongs to another project. Resolve its source bindings explicitly in Advanced JSON first.');value=value.definition;}
 if(!value||typeof value!=='object'||typeof value.name!=='string'||!Array.isArray(value.steps)||value.steps.length>100)throw new Error('Choose a workflow definition with a name and at most 100 steps.');
 const copy=structuredClone(value);delete copy.id;delete copy.updatedAt;copy.revision=0;
 for(const key of ['zones','outputSelections']){copy[key]??=[];if(!Array.isArray(copy[key]))throw new Error(`Workflow ${key} must be a list.`);}
 for(const key of ['projectParameters','wellParameters','zoneParameters']){copy[key]??={};if(typeof copy[key]!=='object'||Array.isArray(copy[key]))throw new Error(`Workflow ${key} must be an object.`);}
 for(const step of copy.steps){if(!step||typeof step!=='object'||Array.isArray(step))throw new Error('Each workflow step must be an object.');step.bindings??={};step.parameters??={};if(typeof step.bindings!=='object'||Array.isArray(step.bindings)||typeof step.parameters!=='object'||Array.isArray(step.parameters))throw new Error('Step bindings and parameters must be objects.');step.reviewRequired=true;step.reviewed=false;for(const binding of Object.values(step.bindings)){if(!binding||typeof binding!=='object'||Array.isArray(binding))throw new Error('Each source binding must be an object.');binding.confirmed=false;}}
 return copy;
}
