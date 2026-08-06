import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// El render pesado va al farm; en local solo previsualizamos en Studio.
Config.setConcurrency(2);
