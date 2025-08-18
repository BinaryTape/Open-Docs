[//]: # (title: 從命令列執行 KSP)

KSP 是一個 Kotlin 編譯器外掛程式，需要與 Kotlin 編譯器一同執行。請下載並解壓縮它們。

```bash
#!/bin/bash

# Kotlin compiler
wget https://github.com/JetBrains/kotlin/releases/download/v%kspSupportedKotlinVersion%/kotlin-compiler-%kspSupportedKotlinVersion%.zip
unzip kotlin-compiler-%kspSupportedKotlinVersion%.zip

# KSP
wget https://github.com/google/ksp/releases/download/%kspSupportedKotlinVersion%-%kspVersion%/artifacts.zip
unzip artifacts.zip
```

若要使用 `kotlinc` 執行 KSP，請將 `-Xplugin` 選項傳遞給 `kotlinc`。

```
-Xplugin=/path/to/symbol-processing-cmdline-%kspSupportedKotlinVersion%-%kspVersion%.jar
```

這與 `symbol-processing-%kspSupportedKotlinVersion%-%kspVersion%.jar` 不同，後者旨在搭配 `kotlin-compiler-embeddable` 在使用 Gradle 執行時使用。命令列 `kotlinc` 需要 `symbol-processing-cmdline-%kspSupportedKotlinVersion%-%kspVersion%.jar`。

您還需要 API JAR 檔。

```
-Xplugin=/path/to/symbol-processing-api-%kspSupportedKotlinVersion%-%kspVersion%.jar
```

請參閱完整範例：

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