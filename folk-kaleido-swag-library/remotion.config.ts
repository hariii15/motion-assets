import {Config} from '@remotion/cli/config';
Config.setCachingEnabled(false);
Config.setBrowserExecutable(process.env.CHROMIUM_PATH??'/usr/bin/chromium');
