import {mkdirSync,readFileSync,writeFileSync,statSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const verify=spawnSync('node_modules/.bin/tsx',['scripts/validate-assets.ts'],{stdio:'inherit',env:{...process.env,TMPDIR:process.cwd()+'/t'}});if(verify.status!==0)process.exit(verify.status??1);
mkdirSync('dist',{recursive:true});const zip='dist/folk-kaleido-swag-assets.zip';
if(existsSync(zip)&&!process.argv.includes('--refresh')){console.log('Existing archive preserved; remove it explicitly to build a replacement.');process.exit(0);}
const r=spawnSync('zip',['-q','-r',zip,'exports','assets','manifests','src','scripts','README.md','LICENSE-ASSETS.md','package.json','package-lock.json','tsconfig.json','remotion.config.ts','-x','*.cache.json','*.partial.webm','*.map','*/.DS_Store'],{stdio:'inherit'});if(r.status!==0)throw Error('Archive failed');const test=spawnSync('unzip',['-tqq',zip],{stdio:'inherit'});if(test.status!==0)throw Error('Archive corrupt');const sha=createHash('sha256').update(readFileSync(zip)).digest('hex');writeFileSync(zip+'.sha256',sha+'  folk-kaleido-swag-assets.zip\n');console.log(`Verified ZIP: ${zip} (${statSync(zip).size} bytes)`);
