---
title: "通过命令行运行 KSP"
---
KSP 是一个 Kotlin 编译器插件，需要与 Kotlin 编译器一起运行。下载并解压它们。

```bash
#!/bin/bash

# Kotlin compiler
wget https://github.com/JetBrains/kotlin/releases/download/v2.1.10/kotlin-compiler-2.1.10.zip
unzip kotlin-compiler-2.1.10.zip

# KSP
wget https://github.com/google/ksp/releases/download/2.1.10-1.0.31/artifacts.zip
unzip artifacts.zip
```

要使用 `kotlinc` 运行 KSP，请将 `-Xplugin` 选项传递给 `kotlinc`。

```
-Xplugin=/path/to/symbol-processing-cmdline-2.1.10-1.0.31.jar
```

这与 `symbol-processing-2.1.10-1.0.31.jar` 不同，后者设计用于在使用 Gradle 运行时与 `kotlin-compiler-embeddable` 一起使用。
命令行 `kotlinc` 需要 `symbol-processing-cmdline-2.1.10-1.0.31.jar`。

你还需要 API jar。

```
-Xplugin=/path/to/symbol-processing-api-2.1.10-1.0.31.jar
```

请参见完整示例：

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