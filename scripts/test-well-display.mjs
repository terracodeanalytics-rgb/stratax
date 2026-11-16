import assert from 'node:assert/strict';
import {axisFor,curvePath,cutoffFillPaths,fillStyle,trackStyleMatches,applyTemplate} from '../frontend/dist/well-canvas-model.js';

let passed=0;
function test(name,check){check();passed++;console.log(name);}
test('Cutoff fills classify values on normal and reversed scales',()=>{
 for(const reverse of [false,true]){
  const rows=[[0,80],[1,20],[2,80]],curve={min:0,max:100,reverse};
  const axis=axisFor(rows,1,curve),path=curvePath(rows,0,1,[0,2],axis,100,100);
  const regions=cutoffFillPaths(path,axis,100,50);
  assert.deepEqual(regions.map(r=>r.side),['above','below','above']);
  assert(regions.every(r=>r.path.endsWith('Z')));
 }
});
test('Logarithmic cutoff crossings use displayed logarithmic positions',()=>{
 const axis=axisFor([[0,1],[1,100]],1,{min:1,max:100,log:true});
 const path=curvePath([[0,1],[1,100]],0,1,[0,1],axis,100,100);
 const regions=cutoffFillPaths(path,axis,100,10);
 assert.deepEqual(regions.map(r=>r.side),['below','above']);
 assert(regions.every(r=>r.path.includes('50,50')));
});
test('Missing samples preserve disconnected fill regions and original rows',()=>{
 const rows=[[0,20],[1,30],[2,null],[3,80],[4,90]],before=JSON.stringify(rows);
 const axis=axisFor(rows,1,{min:0,max:100});
 const regions=cutoffFillPaths(curvePath(rows,0,1,[0,4],axis,100,100),axis,100,50);
 assert.equal(regions.length,2);
 assert.deepEqual(regions.map(r=>r.side),['below','above']);
 assert.equal(JSON.stringify(rows),before);
});
test('Cutoffs outside the axis still fill the visible side',()=>{
 const axis=axisFor([[0,20],[1,80]],1,{min:0,max:100});
 const path=curvePath([[0,20],[1,80]],0,1,[0,1],axis,100,100);
 assert.deepEqual(cutoffFillPaths(path,axis,100,150).map(r=>r.side),['below']);
 assert.deepEqual(cutoffFillPaths(path,axis,100,-50).map(r=>r.side),['above']);
});
test('Style matches require unique types or mnemonics with exact effective units',()=>{
 const gr={id:'gr',propertyType:'Gamma ray',mnemonic:'GR',unit:'gAPI'};
 const target={id:'other',propertyType:'Gamma ray',mnemonic:'CGR',effectiveUnit:'gAPI'};
 const matches=(sources,targets)=>trackStyleMatches({curves:sources},{curves:targets},c=>c);
 assert.equal(matches([gr],[target])[0].target,target);
 assert.equal(matches([gr],[target,{...target,id:'duplicate'}])[0].status,'Ambiguous match');
 assert.equal(matches([gr,{...gr,id:'run2'}],[target])[0].status,'Ambiguous match');
 assert.equal(matches([gr],[{...target,effectiveUnit:'API'}])[0].target,null);
 assert.equal(matches([{...gr,propertyType:'Unclassified'}],[{...target,propertyType:'Unclassified'}])[0].target,null);
 const shale={propertyType:'Shale volume',mnemonic:'VSH',unit:'v/v'};
 assert.equal(matches([shale],[{...shale,mnemonic:'VSHALE'}])[0].status,'Matched');
});
test('Legacy fills and extended fills survive template round trips',()=>{
 assert.deepEqual(fillStyle({}),{fill:'none',fillOpacity:.12,cutoffColor:null,belowColor:null,aboveColor:null});
 const pattern={mnemonic:'GR',unit:'gAPI',color:'#167e73',...fillStyle({fill:'cutoff',fillOpacity:.65,belowColor:'#224466',aboveColor:'#bb6622',cutoffColor:'#990099'}),cutoff:60};
 const template=JSON.parse(JSON.stringify({tracks:[{name:'Gamma',width:120,curves:[pattern]}]}));
 const dataset={id:'run',well:'A',columns:[{id:'depth',mnemonic:'DEPT',unit:'m'},{id:'gr',mnemonic:'GR',unit:'gAPI'}]};
 const well={wellId:'A',tracks:[]};
 assert.deepEqual(applyTemplate(well,template,[dataset]),[]);
 assert.deepEqual(fillStyle(well.tracks[0].curves[0]),fillStyle(pattern));
});
console.log(JSON.stringify({passed}));
