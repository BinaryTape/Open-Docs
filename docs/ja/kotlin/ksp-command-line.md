[//]: # (title: コマンドラインからKSPを実行する)

KSPはKotlinコンパイラプラグインであり、Kotlinコンパイラと共に実行する必要があります。それらをダウンロードして展開してください。

```bash
#!/bin/bash

# Kotlin compiler
wget https://github.com/JetBrains/kotlin/releases/download/v%kspSupportedKotlinVersion%/kotlin-compiler-%kspSupportedKotlinVersion%.zip
unzip kotlin-compiler-%kspSupportedKotlinVersion%.zip

# KSP
wget https://github.com/google/ksp/releases/download/%kspSupportedKotlinVersion%-%kspVersion%/artifacts.zip
unzip artifacts.zip
```

KSPを`kotlinc`で実行するには、`-Xplugin`オプションを`kotlinc`に渡します。

```
-Xplugin=/path/to/symbol-processing-cmdline-%kspSupportedKotlinVersion%-%kspVersion%.jar
```

これは、Gradleで実行する際に`kotlin-compiler-embeddable`と共に使用するために設計された`symbol-processing-%kspSupportedKotlinVersion%-%kspVersion%.jar`とは異なります。
コマンドライン版`kotlinc`は`symbol-processing-cmdline-%kspSupportedKotlinVersion%-%kspVersion%.jar`を必要とします。

API jarも必要です。

```
-Xplugin=/path/to/symbol-processing-api-%kspSupportedKotlinVersion%-%kspVersion%.jar
```

完全な例をご覧ください：

```bash
#!/bin/bash

KSP_PLUGIN_ID=com.google.devtools.ksp.symbol-processing
KSP_PLUGIN_OPT=plugin:$KSP_PLUGIN_ID

KSP_PLUGIN_JAR=./com/google/devtools/ksp/symbol-processing-cmdline/%kspSupportedKotlinVersion%-%kspVersion%/symbol-processing-cmdline-%kspSupportedKotlinVersion%-%kspVersion%.jar
KSP_API_JAR=./com/google/devtools/ksp/symbol-processing-api/%kspSupportedKotlinVersion%-%kspVersion%/symbol-processing-api-%kspSupportedKotlinVersion%-%kspVersion%.jar
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