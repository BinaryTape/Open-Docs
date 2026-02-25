[//]: # (title: LLVM 백엔드 사용자 정의를 위한 팁)
<primary-label ref="advanced"/>

Kotlin/Native 컴파일러는 [LLVM](https://llvm.org/)을 사용하여 다양한 타겟 플랫폼에 맞게 바이너리 실행 파일을 최적화하고 생성합니다.
컴파일 시간의 상당 부분이 LLVM에서 소요되며, 대규모 앱의 경우 이 과정이 허용할 수 없을 정도로 오래 걸릴 수 있습니다.

Kotlin/Native가 LLVM을 사용하는 방식을 사용자 정의하고 최적화 패스(optimization pass) 목록을 조정할 수 있습니다.

## 빌드 로그 확인

LLVM 최적화 패스에 소요되는 컴파일 시간을 파악하기 위해 빌드 로그를 살펴보겠습니다.

1. Gradle이 LLVM 프로파일링 세부 정보를 출력하도록 `-Pkotlin.internal.compiler.arguments.log.level=warning` 옵션을 사용하여 `linkRelease*` Gradle 태스크를 실행합니다. 예를 들어 다음과 같습니다.

   ```bash
   ./gradlew linkReleaseExecutableMacosArm64 -Pkotlin.internal.compiler.arguments.log.level=warning
   ```

   태스크가 실행되는 동안 다음과 같이 필요한 컴파일러 인자(arguments)를 출력합니다.

   ```none
   > Task :linkReleaseExecutableMacosArm64
   Run in-process tool "konanc"
   Entry point method = org.jetbrains.kotlin.cli.utilities.MainKt.daemonMain
   Classpath = [
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/kotlin-native-compiler-embeddable.jar
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/trove4j.jar
   ]
   Arguments = [
           -Xinclude=...
           -library
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib
           -no-endorsed-libs
           -nostdlib
           ...
   ]
   ```

2. 제공된 인자에 `-Xprofile-phases` 인자를 추가하여 커맨드 라인 컴파일러를 실행합니다. 예를 들어 다음과 같습니다.

   ```bash
   /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/bin/kotlinc-native \
   -Xinclude=... \
   -library /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib \
   ... \
   -Xprofile-phases
   ```

3. 빌드 로그에 생성된 출력을 확인합니다. 로그는 수만 줄에 달할 수 있으며, LLVM 프로파일링 섹션은 마지막 부분에 있습니다.

다음은 간단한 Kotlin/Native 프로그램을 실행했을 때의 출력 발췌본입니다.

```none
Frontend: 275 msec
PsiToIr: 1186 msec
...
... 30k lines
...
LinkBitcodeDependencies: 476 msec
StackProtectorPhase: 0 msec
MandatoryBitcodeLLVMPostprocessingPhase: 2 msec
===-------------------------------------------------------------------------===
                          Pass execution timing report
===-------------------------------------------------------------------------===
  Total Execution Time: 6.7726 seconds (6.7192 wall clock)

   ---User Time---   --System Time--   --User+System--   ---Wall Time---  --- Name ---
   0.9778 ( 22.4%)   0.5043 ( 21.0%)   1.4821 ( 21.9%)   1.4628 ( 21.8%)  InstCombinePass
   0.3827 (  8.8%)   0.2497 ( 10.4%)   0.6323 (  9.3%)   0.6283 (  9.4%)  InlinerPass
   0.2815 (  6.4%)   0.1792 (  7.5%)   0.4608 (  6.8%)   0.4555 (  6.8%)  SimplifyCFGPass
...
   0.6444 (100.0%)   0.5474 (100.0%)   1.1917 (100.0%)   1.1870 (100.0%)  Total

ModuleBitcodeOptimization: 8118 msec
...
LTOBitcodeOptimization: 1399 msec
...
```

Kotlin/Native 컴파일러는 모듈 패스(module passes)와 링크 타임 패스(link-time passes)라는 두 가지 별도의 LLVM 최적화 시퀀스를 실행합니다. 일반적인 컴파일의 경우 두 파이프라인이 연달아 실행되며, 실제 유일한 차이점은 실행되는 LLVM 최적화 패스 종류입니다.

위의 로그에서 두 가지 LLVM 최적화는 `ModuleBitcodeOptimization`과 `LTOBitcodeOptimization`입니다. 표 형식의 데이터는 각 패스별 소요 시간이 포함된 최적화 출력 결과입니다.

## LLVM 최적화 패스 사용자 정의

위의 패스 중 하나가 비정상적으로 오래 걸린다면 이를 건너뛸 수 있습니다. 하지만 이는 런타임 성능에 영향을 줄 수 있으므로, 나중에 벤치마크 성능 변화를 확인해야 합니다.

현재 [특정 패스를 직접 비활성화](https://youtrack.jetbrains.com/issue/KT-69212)하는 방법은 없습니다. 대신, 다음 컴파일러 옵션을 사용하여 실행할 패스의 새 목록을 제공할 수 있습니다.

| **옵션** | **릴리스 바이너리의 기본값** |
|------------------------|--------------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                      |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"`    |

기본값은 실제 패스들의 긴 목록으로 확장되므로, 이 중에서 원하지 않는 패스를 제외해야 합니다.

실제 패스 목록을 얻으려면 LLVM 배포판과 함께 `~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin` 디렉토리에 자동으로 다운로드되는 [`opt`](https://llvm.org/docs/CommandGuide/opt.html) 도구를 실행하세요.

예를 들어, 링크 타임 패스 목록을 얻으려면 다음을 실행합니다.

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

그러면 경고 메시지와 함께 LLVM 버전에 따른 긴 패스 목록이 출력됩니다.

`opt` 도구의 패스 목록과 Kotlin/Native 컴파일러가 실제로 실행하는 패스 사이에는 두 가지 차이점이 있습니다.

* `opt`는 디버그 도구이므로 일반적인 경우에는 실행되지 않는 하나 이상의 `verify` 패스가 포함됩니다.
* Kotlin/Native는 Kotlin 컴파일러가 이미 자체적으로 수행하므로 `devirt` 패스를 비활성화합니다.

패스를 비활성화한 후에는 항상 성능 테스트를 다시 실행하여 런타임 성능 저하가 허용 가능한 수준인지 확인하십시오.