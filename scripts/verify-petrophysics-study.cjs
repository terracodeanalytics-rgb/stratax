const assert = require('node:assert/strict');
const fs = require('node:fs');
const {start} = require('./local-science-browser.cjs');

async function verify() {
  const siteBase = process.env.STRATAX_UI_BASE;
  const evidence = siteBase ? '.release/petrophysics-live-20261111/hosted-browser' : '.release/petrophysics-study';
  fs.mkdirSync(evidence, {recursive:true});
  const app = await start({evidence,siteBase,env:{EVALUATION_FIXTURE:'1'}});
  try {
    const {page} = await app.createPage();
    const workflow = page.locator('.pp-study-workflow');
    await workflow.locator('summary').click();
    assert.equal(await workflow.locator('[data-study-stage]').count(), 7);
    await workflow.locator('[data-study-stage=intake]').click();
    await workflow.locator('[data-pp-action=study-data]').click();
    await page.locator('.data-library').waitFor();
    await page.evaluate(()=>{location.hash='interpretation';});
    await workflow.waitFor();
    await workflow.locator('[data-study-stage=quantitative]').click();
    const calculation=workflow.locator('[data-pp-action=study-quantitative]');
    await calculation.click();
    await page.locator('[data-wb-method-choice=shale-linear]').waitFor();
    await page.keyboard.press('Escape');
    await page.locator('#dialog[open]').waitFor({state:'hidden'});
    assert.equal(await calculation.evaluate(button=>button===document.activeElement),true);
    await calculation.click();
    await page.locator('[data-wb-method-choice=shale-linear]').click();
    const assignment = page.locator('#iw-curve-assignments');
    await assignment.waitFor();
    assert.ok(await assignment.locator('.iw-binding').count());
    await page.locator('#iw-finish-assignments').click();
    await page.locator('#iw-properties').waitFor();
    assert.equal(await page.locator('#iw-properties [name=method]').evaluate(field=>field===document.activeElement),true);
    await workflow.locator('[data-study-stage=cutoffs]').click();
    await workflow.locator('[data-pp-action=study-cutoffs]').click();
    const cutoff = page.locator('.iw-inspector #pp-cutoffs');
    await cutoff.locator('[name=name]').fill('Reservoir fixture');
    await cutoff.locator('[name=maxGap]').fill('2');
    await cutoff.locator('#pp-add-rule').click();
    await cutoff.locator('[name=value]').fill('0.3');
    await cutoff.locator('[type=submit],button.primary').click();
    await page.getByText('Reservoir fixture', {exact:true}).first().waitFor();
    await page.reload();
    await workflow.locator('[data-study-stage=cutoffs][aria-pressed=true]').waitFor();
    await page.getByText('Reservoir fixture', {exact:true}).first().waitFor();
    await workflow.locator('[data-study-stage=map]').click();
    await workflow.locator('[data-pp-action=study-map]').click();
    await page.locator('.map-workspace').waitFor();
    await page.locator('.mw-inspector-actions [data-map-command=interpretation]').click();
    await page.locator('.wb-active-well').waitFor();
    const source = app.data.scenarios.find(item=>item.method==='qc-splice').window.datasetId;
    const treeWell = page.locator('details[data-wb-tree-well="A"]');
    if (await treeWell.getAttribute('open') === null) await treeWell.locator(':scope > summary').click();
    const treeRun = treeWell.locator(`details[data-wb-tree-key="run:${source}"]`);
    if (await treeRun.getAttribute('open') === null) await treeRun.locator(':scope > summary').click();
    await treeRun.locator('[data-wb-add-curve]').first().click();
    await workflow.locator('[data-study-stage=qualitative]').click();
    await workflow.locator('[data-pp-action=crossplot]').click();
    await page.locator('#wb-dialog-form button[type=submit]').click();
    const plot = page.locator('#wb-crossplot-svg');
    await plot.waitFor();
    const firstPoint = plot.locator('[data-wb-sample-row]').first();
    const sampleRow = Number(await firstPoint.getAttribute('data-wb-sample-row'));
    await firstPoint.click();
    await page.locator('[data-wb-action=record-crossplot]').click();
    await page.locator('#wb-dialog-form [name=label]').fill('Reviewed crossplot interval');
    await page.locator('#wb-dialog-form [name=evidence]').fill('Selected samples on the controlled fixture.');
    await page.locator('#wb-dialog-form button[type=submit]').click();
    await page.locator('#dialog[open]').waitFor({state:'hidden'});
    const observation = await page.evaluate(()=>{
      const portfolio = JSON.parse(localStorage.getItem('stratax.projects.v2:owner'));
      return portfolio.contexts[portfolio.activeId].interpretation.annotations.find(item=>item.label==='Reviewed crossplot interval');
    });
    assert.deepEqual(observation?.geometry.rowRanges, [[sampleRow,sampleRow]]);
    assert.equal(observation.geometry.curveIds.length, 2);
    assert.ok(observation.wellId && observation.datasetId);
    await page.locator('.wb-active-well .wb-curve-chip').first().click({button:'right'});
    await page.locator('[data-wb-context-action=repair]').click();
    assert.equal(await page.locator('#dialog [data-wb-method-choice]').count(),4);
    await page.keyboard.press('Escape');
    await page.locator('#dialog[open]').waitFor({state:'hidden'});
    const cutoffFixture = app.data.scenarios.find(item=>item.method==='cutoff-rules').window;
    const bindings = Object.fromEntries(Object.entries(cutoffFixture.bindings).map(([role,binding])=>[role,{...binding,confirmed:true}]));
    const cases = [];
    for (const threshold of [0.3,0.6]) {
      const label = `Shale cutoff ${threshold}`;
      const id = `study-cutoff-${threshold*10}`;
      const configuration = await app.science(`/configurations/${id}`,{
        revision:0,method:'cutoff-rules',bindings,notes:label,
        parameters:{...cutoffFixture.parameters,rules:[{role:'vsh',operator:'<=',value:threshold}]}
      },'PUT');
      const run = await app.science('/runs',{configurationId:configuration.id,revision:configuration.revision,idempotencyKey:id});
      const result = await app.science(`/runs/${run.id}/result`);
      cases.push({run,label,result});
    }
    await workflow.locator('[data-study-stage=cutoffs]').click();
    await workflow.locator('[data-pp-action=scenarios]').click();
    for (const {run} of cases) await page.locator(`#pp-scenarios input[value="${run.id}"]`).check();
    await page.locator('#pp-scenarios button').click();
    const tracks = page.locator('.pp-cutoff-comparison figure');
    await tracks.first().waitFor();
    assert.equal(await tracks.count(),2);
    for (const {label,result} of cases) {
      const track = tracks.filter({has:page.getByText(label,{exact:true})});
      assert.equal(await track.locator('circle').count(),result.preview.depth.filter(Number.isFinite).length);
      assert.equal(await track.locator('circle[cx="80"]').count(),result.preview.qualified.filter(flag=>flag===1).length);
    }
    assert.deepEqual(app.errors, []);
    console.log('Seven stages, curve assignment, reload, map-to-log handoff, crossplot evidence, and two computed cutoff scenarios passed.');
  } finally {
    await app.close();
  }
}

verify().catch(error=>{console.error(error);process.exitCode=1;});
