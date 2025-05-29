[//]: # (title: Kotlin 컴포넌트의 안정성)

Kotlin 언어 및 툴셋은 JVM, JS, Native 타겟용 컴파일러, 표준 라이브러리, 다양한 부속 도구 등 여러 컴포넌트로 나뉩니다. 이들 컴포넌트 중 상당수는 **Stable**로 공식 출시되었으며, 이는 [_편안한 업데이트_ 및 _언어 현대성 유지_ 원칙](kotlin-evolution-principles.md)에 따라 하위 호환 방식으로 발전되었음을 의미합니다.

_피드백 루프_ 원칙에 따라, 커뮤니티가 사용해 볼 수 있도록 많은 것을 조기에 출시하므로 아직 **Stable**로 출시되지 않은 컴포넌트도 다수 있습니다. 일부는 매우 초기 단계에 있으며, 일부는 더 성숙합니다. 각 컴포넌트가 얼마나 빠르게 발전하는지와 사용자가 채택할 때 부담하는 위험 수준에 따라 **Experimental**, **Alpha** 또는 **Beta**로 표시합니다.

## 안정성 수준 설명

다음은 이러한 안정성 수준과 그 의미에 대한 간략한 안내입니다.

**Experimental**은 "장난감 프로젝트에서만 사용해 보세요"를 의미합니다.
  * 아이디어를 시도하고 있으며, 일부 사용자가 이를 사용해보고 피드백을 주기를 원합니다. 잘 되지 않으면 언제든지 중단할 수 있습니다.

**Alpha**는 "위험을 감수하고 사용하세요, 마이그레이션 문제가 발생할 수 있습니다"를 의미합니다.
  * 이 아이디어를 제품화할 계획이지만, 아직 최종 형태에 도달하지 못했습니다.

**Beta**는 "사용할 수 있습니다. 마이그레이션 문제를 최소화하기 위해 최선을 다할 것입니다"를 의미합니다.
  * 거의 완료되었습니다. 사용자 피드백이 지금 특히 중요합니다.
  * 아직 100% 완료된 것은 아니므로 변경될 가능성이 있습니다(사용자 피드백을 기반으로 한 변경 포함).
  * 최상의 업데이트 경험을 위해 미리 사용 중단 경고를 확인하세요.

저희는 _Experimental_, _Alpha_, _Beta_를 통틀어 **pre-stable** 수준이라고 부릅니다.

<a name="stable"/>

**Stable**은 "가장 보수적인 시나리오에서도 사용하세요"를 의미합니다.
  * 완료되었습니다. 엄격한 [하위 호환성 규칙](https://kotlinfoundation.org/language-committee-guidelines/)에 따라 발전시킬 것입니다.

안정성 수준은 컴포넌트가 얼마나 빨리 Stable로 출시될지에 대해 아무것도 말해주지 않는다는 점에 유의하십시오. 마찬가지로, 출시 전 컴포넌트가 얼마나 변경될지 나타내지 않습니다. 단지 컴포넌트가 얼마나 빠르게 변화하고 있는지, 사용자가 업데이트 문제에 얼마나 많은 위험을 부담하는지를 보여줍니다.

## Kotlin 컴포넌트용 GitHub 배지

[Kotlin GitHub 조직](https://github.com/Kotlin)은 다양한 Kotlin 관련 프로젝트를 호스팅합니다. 일부는 전담 개발하고, 다른 일부는 사이드 프로젝트입니다.

각 Kotlin 프로젝트에는 안정성 및 지원 상태를 설명하는 두 가지 GitHub 배지가 있습니다.

*   **안정성** 상태. 이는 각 프로젝트가 얼마나 빠르게 발전하고 있으며, 사용자가 이를 채택할 때 얼마나 많은 위험을 부담하는지를 보여줍니다.
    이 안정성 상태는 [Kotlin 언어 기능 및 컴포넌트의 안정성 수준](#stability-levels-explained)과 완벽하게 일치합니다.
    *   ![Experimental stability level](https://kotl.in/badges/experimental.svg){type="joined"}는 **Experimental**을 의미합니다.
    *   ![Alpha stability level](https://kotl.in/badges/alpha.svg){type="joined"}는 **Alpha**를 의미합니다.
    *   ![Beta stability level](https://kotl.in/badges/beta.svg){type="joined"}는 **Beta**를 의미합니다.
    *   ![Stable stability level](https://kotl.in/badges/stable.svg){type="joined"}는 **Stable**을 의미합니다.

*   **지원** 상태. 이는 프로젝트를 유지하고 사용자가 문제를 해결하도록 돕는 우리의 노력을 보여줍니다.
    지원 수준은 모든 JetBrains 제품에 대해 통일되어 있습니다.
    자세한 내용은 [JetBrains 오픈 소스 문서](https://github.com/JetBrains#jetbrains-on-github)를 참조하세요.

## 하위 컴포넌트의 안정성

안정적인 컴포넌트도 Experimental 하위 컴포넌트를 가질 수 있습니다. 예를 들어:
*   안정적인 컴파일러는 Experimental 기능을 가질 수 있습니다.
*   안정적인 API는 Experimental 클래스 또는 함수를 포함할 수 있습니다.
*   안정적인 명령줄 도구는 Experimental 옵션을 가질 수 있습니다.

저희는 어떤 하위 컴포넌트가 **Stable**이 아닌지 정확하게 문서화합니다. 또한 가능한 경우 사용자에게 경고하고, Stable로 출시되지 않은 기능을 의도치 않게 사용하는 것을 방지하기 위해 명시적으로 동의하도록 요청하는 데 최선을 다합니다.

## Kotlin 컴포넌트의 현재 안정성

> 기본적으로 모든 새로운 컴포넌트는 Experimental 상태입니다.
>
{style="note"}

### Kotlin 컴파일러

| **컴포넌트**                                                        | **상태**     | **버전 이후 상태** | **비고** |
|---------------------------------------------------------------------|------------|--------------------|--------------|
| Kotlin/JVM                                                          | Stable     | 1.0.0              |              |
| Kotlin/Native                                                       | Stable     | 1.9.0              |              |
| Kotlin/JS                                                           | Stable     | 1.3.0              |              |
| Kotlin/Wasm                                                         | Alpha      | 1.9.20             |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                    |              |

### 코어 컴파일러 플러그인

| **컴포넌트**                                     | **상태**       | **버전 이후 상태** | **비고** |
|--------------------------------------------------|--------------|--------------------|--------------|
| [All-open](all-open-plugin.md)                   | Stable       | 1.3.0              |              |
| [No-arg](no-arg-plugin.md)                       | Stable       | 1.3.0              |              |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | Stable       | 1.3.0              |              |
| [kapt](kapt.md)                                  | Stable       | 1.3.0              |              |
| [Lombok](lombok.md)                              | Experimental | 1.5.20             |              |
| [Power-assert](power-assert.md)                  | Experimental | 2.0.0              |              |

### Kotlin 라이브러리

| **컴포넌트**         | **상태** | **버전 이후 상태** | **비고** |
|-----------------------|------------|--------------------|--------------|
| kotlin-stdlib (JVM)   | Stable     | 1.0.0              |              |
| kotlinx-coroutines    | Stable     | 1.3.0              |              |
| kotlinx-serialization | Stable     | 1.0.0              |              |
| kotlin-metadata-jvm   | Stable     | 2.0.0              |              |
| kotlin-reflect (JVM)  | Beta       | 1.0.0              |              |
| kotlinx-datetime      | Alpha      | 0.2.0              |              |
| kotlinx-io            | Alpha      | 0.2.0              |              |

### Kotlin 멀티플랫폼

| **컴포넌트**                                   | **상태** | **버전 이후 상태** | **비고**                                                           |
|------------------------------------------------|------------|--------------------|----------------------------------------------------------------------|
| Kotlin Multiplatform                           | Stable     | 1.9.20             |                                                                      |
| Kotlin Multiplatform plugin for Android Studio | Beta       | 0.8.0              | [언어와 별도로 버전이 관리됩니다](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-plugin-releases.html) |

### Kotlin/Native

| **컴포넌트**                                | **상태** | **버전 이후 상태** | **비고**                                |
|----------------------------------------------|------------|--------------------|-----------------------------------------|
| Kotlin/Native Runtime                        | Stable     | 1.9.20             |                                         |
| C 및 Objective-C와 Kotlin/Native 상호 운용   | Beta       | 1.3.0              |                                         |
| klib binaries                                | Stable     | 1.9.20             | 아래 cinterop klib은 포함하지 않습니다 |
| cinterop klib binaries                       | Beta       | 1.3.0              |                                         |
| CocoaPods integration                        | Stable     | 1.9.20             |                                         |

> Kotlin/Native 타겟 지원에 대한 자세한 내용은 [](native-target-support.md)를 참조하세요.

### 언어 도구

| **컴포넌트**                         | **상태**       | **버전 이후 상태** | **비고**                                           |
|---------------------------------------|--------------|--------------------|------------------------------------------------|
| 스크립팅 구문 및 의미                 | Alpha        | 1.2.0              |                                                |
| 스크립팅 임베딩 및 확장 API           | Beta         | 1.5.0              |                                                |
| 스크립팅 IDE 지원                     | Beta         |                    | IntelliJ IDEA 2023.1 이상 버전에서 사용 가능 |
| CLI 스크립팅                          | Alpha        | 1.2.0              |                                                |

## 언어 기능 및 설계 제안

언어 기능 및 새로운 설계 제안에 대한 자세한 내용은 [](kotlin-language-features-and-proposals.md)를 참조하세요.