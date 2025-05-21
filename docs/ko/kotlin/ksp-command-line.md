---
title: "명령줄에서 KSP 실행하기"
---
KSP는 Kotlin 컴파일러 플러그인이므로 Kotlin 컴파일러와 함께 실행해야 합니다. 다음을 다운로드하여 압축을 해제하세요.

```bash
#!/bin/bash

# Kotlin compiler
wget https://github.com/JetBrains/kotlin/releases/download/v2.1.10/kotlin-compiler-2.1.10.zip
unzip kotlin-compiler-2.1.10.zip

# KSP
wget https://github.com/google/ksp/releases/download/2.1.10-1.0.31/artifacts.zip
unzip artifacts.zip
```

`kotlinc`으로 KSP를 실행하려면 `kotlinc`에 `-Xplugin` 옵션을 전달합니다.

```
-Xplugin=/path/to/symbol-processing-cmdline-2.1.10-1.0.31.jar
```

이것은 Gradle과 함께 실행할 때 `kotlin-compiler-embeddable`과 함께 사용하도록 설계된 `symbol-processing-2.1.10-1.0.31.jar`와는 다릅니다.
명령줄 `kotlinc`는 `symbol-processing-cmdline-2.1.10-1.0.31.jar`가 필요합니다.

API jar도 필요합니다.

```
-Xplugin=/path/to/symbol-processing-api-2.1.10-1.0.31.jar
```

전체 예제를 참조하세요.

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