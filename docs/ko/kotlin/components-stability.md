[//]: # (title: Kotlin 컴포넌트의 안정성)

Kotlin 언어와 툴셋은 JVM, JS 및 Native 타겟용 컴파일러, 표준 라이브러리, 다양한 부속 도구 등 여러 컴포넌트로 나뉩니다. 이들 컴포넌트 중 다수는 공식적으로 **안정 (Stable)** 버전으로 출시되었습니다. 이는 [_편안한 업데이트_ 및 _언어 현대성 유지_ 원칙](kotlin-evolution-principles.md)에 따라 하위 호환성 방식으로 발전되었음을 의미합니다.

_피드백 루프 (Feedback Loop)_ 원칙에 따라, 우리는 커뮤니티가 사용해 볼 수 있도록 많은 것을 조기에 출시합니다. 따라서 아직 **안정 (Stable)** 버전으로 출시되지 않은 컴포넌트가 많습니다. 그중 일부는 초기 단계에 있고, 일부는 더 성숙한 단계에 있습니다. 각 컴포넌트가 발전하는 속도와 사용자가 채택 시 감수해야 하는 위험 수준에 따라 **실험적 (Experimental)**, **알파 (Alpha)** 또는 **베타 (Beta)**로 표시합니다.

## 안정성 수준 설명

다음은 이러한 안정성 수준과 그 의미에 대한 간략한 가이드입니다.

**실험적 (Experimental)**은 "시험용 프로젝트에서만 시도해보세요"를 의미합니다:
*   우리는 단지 아이디어를 시도해보고 일부 사용자들이 사용해보면서 피드백을 주기를 원합니다. 만약 잘 되지 않으면, 언제든지 중단할 수 있습니다.

**알파 (Alpha)**는 "위험을 감수하고 사용하세요, 마이그레이션 문제가 발생할 수 있습니다"를 의미합니다:
*   우리는 이 아이디어를 제품화할 계획이지만, 아직 최종 형태에 도달하지 않았습니다.

**베타 (Beta)**는 "사용해도 좋습니다, 마이그레이션 문제를 최소화하기 위해 최선을 다할 것입니다"를 의미합니다:
*   거의 완료되었으며, 지금은 사용자 피드백이 특히 중요합니다.
*   아직 100% 완료된 것은 아니므로 변경될 수 있습니다 (자체 피드백에 기반한 변경 포함).
*   최고의 업데이트 경험을 위해 미리 지원 중단 경고에 유의하십시오.

우리는 _실험적 (Experimental)_, _알파 (Alpha)_ 및 _베타 (Beta)_를 통틀어 **사전 안정화 (pre-stable)** 수준이라고 부릅니다.

<a name="stable"/>

**안정 (Stable)**은 "가장 보수적인 시나리오에서도 사용하세요"를 의미합니다:
*   완료되었습니다. 우리는 엄격한 [하위 호환성 규칙](https://kotlinfoundation.org/language-committee-guidelines/)에 따라 발전시킬 것입니다.

안정성 수준은 컴포넌트가 얼마나 빨리 안정 (Stable) 버전으로 출시될지에 대해 아무것도 말해주지 않는다는 점에 유의하십시오. 마찬가지로, 출시 전에 컴포넌트가 얼마나 많이 변경될지 나타내지 않습니다. 이들은 단지 컴포넌트가 얼마나 빠르게 변경되고 있으며, 사용자가 얼마나 많은 업데이트 문제 위험을 감수하는지를 나타낼 뿐입니다.

## Kotlin 컴포넌트용 GitHub 배지

[Kotlin GitHub 조직](https://github.com/Kotlin)은 다양한 Kotlin 관련 프로젝트를 호스팅합니다. 이 중 일부는 전담으로 개발하고 있으며, 다른 일부는 사이드 프로젝트입니다.

각 Kotlin 프로젝트에는 안정성 및 지원 상태를 설명하는 두 가지 GitHub 배지가 있습니다:

*   **안정성 (Stability)** 상태. 이는 각 프로젝트가 얼마나 빠르게 발전하고 있으며, 사용자가 채택 시 얼마나 많은 위험을 감수하는지를 보여줍니다.
    이 안정성 상태는 [Kotlin 언어 기능 및 컴포넌트의 안정성 수준](#stability-levels-explained)과 완전히 일치합니다:
    *   ![Experimental stability level](https://kotl.in/badges/experimental.svg){type="joined"}은 **실험적 (Experimental)**을 나타냅니다.
    *   ![Alpha stability level](https://kotl.in/badges/alpha.svg){type="joined"}은 **알파 (Alpha)**를 나타냅니다.
    *   ![Beta stability level](https://kotl.in/badges/beta.svg){type="joined"}은 **베타 (Beta)**를 나타냅니다.
    *   ![Stable stability level](https://kotl.in/badges/stable.svg){type="joined"}은 **안정 (Stable)**을 나타냅니다.

*   **지원 (Support)** 상태. 이는 프로젝트를 유지보수하고 사용자가 문제를 해결하도록 돕는 우리의 약속을 보여줍니다.
    지원 수준은 모든 JetBrains 제품에 대해 통일되어 있습니다.  
    [자세한 내용은 JetBrains 오픈 소스 문서를 참조하십시오](https://github.com/JetBrains#jetbrains-on-github).

## 하위 컴포넌트의 안정성

안정 (Stable) 컴포넌트에는 실험적 (Experimental) 하위 컴포넌트가 있을 수 있습니다. 예를 들어:
*   안정 (Stable) 컴파일러에 실험적 (Experimental) 기능이 있을 수 있습니다;
*   안정 (Stable) API에 실험적 (Experimental) 클래스 또는 함수가 포함될 수 있습니다;
*   안정 (Stable) 명령줄 도구에 실험적 (Experimental) 옵션이 있을 수 있습니다.

어떤 하위 컴포넌트가 **안정 (Stable)** 버전이 아닌지 정확히 문서화하고 있습니다.
또한, 가능한 경우 사용자에게 경고하고, 안정 (Stable) 버전으로 출시되지 않은 기능을 실수로 사용하는 것을 방지하기 위해 명시적으로 옵트인 (opt in)하도록 요청합니다.

## Kotlin 컴포넌트의 현재 안정성

> 기본적으로 모든 새 컴포넌트는 실험적 (Experimental) 상태입니다.
>
{style="note"}

### Kotlin 컴파일러

| **컴포넌트**                                                       | **상태**      | **버전 출시 이후 상태** | **설명** |
|:-------------------------------------------------------------------|:--------------|:-------------------|:---------|
| Kotlin/JVM                                                         | 안정 (Stable) | 1.0.0              |          |
| Kotlin/Native                                                      | 안정 (Stable) | 1.9.0              |          |
| Kotlin/JS                                                          | 안정 (Stable) | 1.3.0              |          |
| Kotlin/Wasm                                                        | 베타 (Beta)  | 2.2.20             |          |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | 안정 (Stable) |                    |          |

### 코어 컴파일러 플러그인

| **컴포넌트**                                    | **상태**          | **버전 출시 이후 상태** | **설명** |
|:------------------------------------------------|:------------------|:-------------------|:---------|
| [All-open](all-open-plugin.md)                  | 안정 (Stable)    | 1.3.0              |          |
| [No-arg](no-arg-plugin.md)                      | 안정 (Stable)    | 1.3.0              |          |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | 안정 (Stable)    | 1.3.0              |          |
| [kapt](kapt.md)                                 | 안정 (Stable)    | 1.3.0              |          |
| [Lombok](lombok.md)                             | 실험적 (Experimental) | 1.5.20             |          |
| [Power-assert](power-assert.md)                 | 실험적 (Experimental) | 2.0.0              |          |

### Kotlin 라이브러리

| **컴포넌트**         | **상태**      | **버전 출시 이후 상태** | **설명** |
|:---------------------|:--------------|:-------------------|:---------|
| kotlin-stdlib (JVM)  | 안정 (Stable) | 1.0.0              |          |
| kotlinx-coroutines    | 안정 (Stable) | 1.3.0              |          |
| kotlinx-serialization | 안정 (Stable) | 1.0.0              |          |
| kotlin-metadata-jvm  | 안정 (Stable) | 2.0.0              |          |
| kotlin-reflect (JVM) | 베타 (Beta)  | 1.0.0              |          |
| kotlinx-datetime      | 알파 (Alpha) | 0.2.0              |          |
| kotlinx-io            | 알파 (Alpha) | 0.2.0              |          |

### Kotlin 멀티플랫폼

| **컴포넌트**                                                | **상태**      | **버전 출시 이후 상태** | **설명**                                                                                                                              |
|:------------------------------------------------------------|:--------------|:-------------------|:------------------------------------------------------------------------------------------------------------------------------------|
| Kotlin 멀티플랫폼                                           | 안정 (Stable) | 1.9.20             |                                                                                                                                     |
| Android Studio용 Kotlin 멀티플랫폼 플러그인 (Kotlin Multiplatform plugin for Android Studio) | 베타 (Beta)  | 0.8.0              | [언어와 별도로 버전 관리됨](https://kotlinlang.org/docs/multiplatform/multiplatform-plugin-releases.html) |

### Kotlin/Native

| **컴포넌트**                                            | **상태**      | **버전 출시 이후 상태** | **설명**                                                                             |
|:--------------------------------------------------------|:--------------|:-------------------|:-------------------------------------------------------------------------------------|
| Kotlin/Native 런타임 (Runtime)                             | 안정 (Stable) | 1.9.20             |                                                                                      |
| C 및 Objective-C와의 Kotlin/Native 상호 운용 (interop)   | 베타 (Beta)  | 1.3.0              | [C 및 Objective-C 라이브러리 임포트의 안정성](native-c-interop-stability.md) |
| klib 바이너리 (binaries)                                 | 안정 (Stable) | 1.9.20             | cinterop klib 제외, 아래 참조                                                    |
| cinterop klib 바이너리 (binaries)                        | 베타 (Beta)  | 1.3.0              | [C 및 Objective-C 라이브러리 임포트의 안정성](native-c-interop-stability.md) |
| CocoaPods 통합 (integration)                             | 안정 (Stable) | 1.9.20             |                                                                                      |

다양한 타겟에 대한 지원 수준에 대한 자세한 내용은 [](native-target-support.md)를 참조하십시오.

### 언어 도구

| **컴포넌트**                                              | **상태**      | **버전 출시 이후 상태** | **설명**                                          |
|:----------------------------------------------------------|:--------------|:-------------------|:--------------------------------------------------|
| 스크립팅 구문 및 의미 (Scripting syntax and semantics)       | 알파 (Alpha) | 1.2.0              |                                                   |
| 스크립팅 임베딩 및 확장 API (Scripting embedding and extension API) | 베타 (Beta)  | 1.5.0              |                                                   |
| 스크립팅 IDE 지원 (Scripting IDE support)                   | 베타 (Beta)  |                    | IntelliJ IDEA 2023.1 이상 버전에서 사용 가능 |
| CLI 스크립팅 (CLI scripting)                               | 알파 (Alpha) | 1.2.0              |                                                   |

## 언어 기능 및 설계 제안

언어 기능 및 새로운 설계 제안에 대한 자세한 내용은 [](kotlin-language-features-and-proposals.md)를 참조하십시오.