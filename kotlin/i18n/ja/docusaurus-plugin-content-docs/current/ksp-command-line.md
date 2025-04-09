---
title: コマンドラインからKSPを実行する
---
KSPはKotlinコンパイラープラグインであり、Kotlinコンパイラーとともに実行する必要があります。それらをダウンロードして展開してください。

```bash
#!/bin/bash

# Kotlin compiler
wget https://github.com/JetBrains/kotlin/releases/download/v2.1.10/kotlin-compiler-2.1.10.zip
unzip kotlin-compiler-2.1.10.zip

# KSP
wget https://github.com/google/ksp/releases/download/2.1.10-1.0.31/artifacts.zip
unzip artifacts.zip
```

KSPを`kotlinc`で実行するには、`-Xplugin`オプションを`kotlinc`に渡します。

```
-Xplugin=/path/to/symbol-processing-cmdline-2.1.10-1.0.31.jar
```

これは、Gradleで実行する際に`kotlin-compiler-embeddable`で使用するように設計されている`symbol-processing-2.1.10-1.0.31.jar`とは異なります。
コマンドライン`kotlinc`は`symbol-processing-cmdline-2.1.10-1.0.31.jar`を必要とします。

API jarも必要になります。

```
-Xplugin=/path/to/symbol-processing-api-2.1.10-1.0.31.jar
```

完全な例をご覧ください。

```bash
#!/bin/bash

KSP_PLUGIN_ID=com.google.devtools.ksp.symbol-processing
KSP_PLUGIN_OPT=plugin:$KSP_PLUGIN_ID

KSP_PLUGIN_JAR=./com/google/devtools/ksp/symbol-processing-cmdline/2.1.10-1.0.31/symbol-processing-cmdline-2.1.10-1.0.31.jar
KSP_API_JAR=./com/google/devtools/ksp/symbol-processing-api/2.1.10-1.0.31/symbol-processing-api-2.1.10-1.0.31.jar
KOTLINC=./kotlinc/bin/kotlinc

AP=/path/to/your-processor.jar

mkdir out
$KOTLINC \
        -Xplugin=$KSP_PLUGIN_JAR \
        -Xplugin=$KSP_API_JAR \
        -Xallow-no-source-files \
        -P $KSP_PLUGIN_OPT:apclasspath=$AP \
        -P $KSP_PLUGIN_OPT:projectBaseDir=. \
        -P $KSP_PLUGIN_OPT:classOutputDir=./out \
        -P $KSP_PLUGIN_OPT:javaOutputDir=./out \
        -P $KSP_PLUGIN_OPT:kotlinOutputDir=./out \
        -P $KSP_PLUGIN_OPT:resourceOutputDir=./out \
        -P $KSP_PLUGIN_OPT:kspOutputDir=./out \
        -P $KSP_PLUGIN_OPT:cachesDir=./out \
        -P $KSP_PLUGIN_OPT:incremental=false \
        -P $KSP_PLUGIN_OPT:apoption=key1=value1 \
        -P $KSP_PLUGIN_OPT:apoption=key2=value2 \
        $*
```