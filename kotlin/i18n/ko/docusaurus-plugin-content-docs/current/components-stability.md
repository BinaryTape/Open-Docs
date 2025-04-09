---
title: "Kotlin 구성 요소 안정성"
---
Kotlin 언어 및 툴 세트는 JVM, JS 및 Native 타겟용 컴파일러, 표준 라이브러리, 다양한 도구 등 여러 컴포넌트로 나뉩니다. 이러한 컴포넌트 중 다수가 공식적으로 **Stable**로 릴리스되었으며, 이는 [_Comfortable Updates_ 및 _Keeping the Language Modern_ 원칙](kotlin-evolution-principles)에 따라 이전 버전과의 호환성을 유지하면서 발전해 왔음을 의미합니다.

_피드백 루프_ 원칙에 따라 커뮤니티에서 사용해 볼 수 있도록 많은 기능을 조기에 릴리스하므로, 아직 **Stable**로 릴리스되지 않은 컴포넌트가 많습니다. 일부는 매우 초기 단계에 있고, 일부는 더 성숙한 단계에 있습니다. 각 컴포넌트의 발전 속도와 사용자가 채택할 때 감수하는 위험 수준에 따라 **Experimental**, **Alpha** 또는 **Beta**로 표시합니다.

## 안정성 수준 설명

다음은 이러한 안정성 수준과 그 의미에 대한 간략한 안내입니다.

**Experimental**은 "장난감 프로젝트에서만 사용해 보세요"를 의미합니다.
  * 아이디어를 시험해 보고 일부 사용자가 사용해 보고 피드백을 제공하기를 원합니다. 작동하지 않으면 언제든지 삭제할 수 있습니다.

**Alpha**는 "자신의 책임 하에 사용하고 마이그레이션 문제를 예상하세요"를 의미합니다.
  * 이 아이디어를 제품화할 계획이지만 아직 최종 형태에 도달하지 못했습니다.

**Beta**는 "사용할 수 있으며 마이그레이션 문제를 최소화하기 위해 최선을 다할 것입니다"를 의미합니다.
  * 거의 완료되었으며 사용자 피드백이 특히 중요합니다.
  * 아직 100% 완료된 것은 아니므로 변경 사항(사용자 피드백에 따른 변경 사항 포함)이 있을 수 있습니다.
  * 최상의 업데이트 경험을 위해 미리 더 이상 사용되지 않는 기능에 대한 경고를 확인하세요.

_Experimental_, _Alpha_ 및 _Beta_를 통칭하여 **pre-stable** 수준이라고 합니다.

<a name="stable"/>

**Stable**은 "가장 보수적인 시나리오에서도 사용하세요"를 의미합니다.
  * 완료되었습니다. 엄격한 [이전 버전과의 호환성 규칙](https://kotlinfoundation.org/language-committee-guidelines/)에 따라 발전시켜 나갈 것입니다.

안정성 수준은 컴포넌트가 얼마나 빨리 Stable로 릴리스될지에 대한 정보를 제공하지 않습니다. 마찬가지로 컴포넌트가 릴리스되기 전에 얼마나 많이 변경될지 나타내지도 않습니다. 컴포넌트가 얼마나 빠르게 변경되고 사용자가 업데이트 문제의 위험을 얼마나 감수하는지만 알려줍니다.

## Kotlin 컴포넌트에 대한 GitHub 배지

[Kotlin GitHub organization](https://github.com/Kotlin)은 다양한 Kotlin 관련 프로젝트를 호스팅합니다.
그 중 일부는 풀타임으로 개발하고, 일부는 사이드 프로젝트입니다.

각 Kotlin 프로젝트에는 안정성 및 지원 상태를 설명하는 두 개의 GitHub 배지가 있습니다.

* **Stability** 상태. 각 프로젝트가 얼마나 빠르게 발전하고 사용자가 채택할 때 얼마나 많은 위험을 감수하는지 보여줍니다.
  안정성 상태는 [Kotlin 언어 기능 및 컴포넌트의 안정성 수준](#stability-levels-explained)과 완전히 일치합니다.
    * <img src="https://kotl.in/badges/experimental.svg" alt="Experimental stability level" style={{verticalAlign: 'middle'}}/>은 **Experimental**을 나타냅니다.
    * <img src="https://kotl.in/badges/alpha.svg" alt="Alpha stability level" style={{verticalAlign: 'middle'}}/>은 **Alpha**를 나타냅니다.
    * <img src="https://kotl.in/badges/beta.svg" alt="Beta stability level" style={{verticalAlign: 'middle'}}/>은 **Beta**를 나타냅니다.
    * <img src="https://kotl.in/badges/stable.svg" alt="Stable stability level" style={{verticalAlign: 'middle'}}/>은 **Stable**을 나타냅니다.

* **Support** 상태. 프로젝트를 유지 관리하고 사용자가 문제를 해결하도록 돕겠다는 약속을 보여줍니다.
  지원 수준은 모든 JetBrains 제품에 대해 통합되어 있습니다.
  [자세한 내용은 JetBrains Open Source 문서를 참조하세요](https://github.com/JetBrains#jetbrains-on-github).

## 하위 컴포넌트의 안정성

안정적인 컴포넌트에는 실험적인 하위 컴포넌트가 있을 수 있습니다. 예를 들면 다음과 같습니다.
* 안정적인 컴파일러에 실험적인 기능이 있을 수 있습니다.
* 안정적인 API에 실험적인 클래스 또는 함수가 포함될 수 있습니다.
* 안정적인 명령줄 도구에 실험적인 옵션이 있을 수 있습니다.

**Stable**이 아닌 하위 컴포넌트를 정확하게 문서화해야 합니다.
또한 가능하면 사용자에게 경고하고 안정적으로 릴리스되지 않은 기능을 실수로 사용하지 않도록 명시적으로 선택하도록 요청하기 위해 최선을 다합니다.

## Kotlin 컴포넌트의 현재 안정성

:::note
기본적으로 모든 새 컴포넌트는 Experimental 상태입니다.

:::

### Kotlin 컴파일러

| **Component**                                                       | **Status** | **Status since version** | **Comments** |
|---------------------------------------------------------------------|------------|--------------------------|--------------|
| Kotlin/JVM                                                          | Stable     | 1.0.0                    |              |
| Kotlin/Native                                                       | Stable     | 1.9.0                    |              |
| Kotlin/JS                                                           | Stable     | 1.3.0                    |              |
| Kotlin/Wasm                                                         | Alpha      | 1.9.20                   |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                          |              |

### 핵심 컴파일러 플러그인

| **Component**                                    | **Status**   | **Status since version** | **Comments** |
|--------------------------------------------------|--------------|--------------------------|--------------|
| [All-open](all-open-plugin)                   | Stable       | 1.3.0                    |              |
| [No-arg](no-arg-plugin)                       | Stable       | 1.3.0                    |              |
| [SAM-with-receiver](sam-with-receiver-plugin) | Stable       | 1.3.0                    |              |
| [kapt](kapt)                                  | Stable       | 1.3.0                    |              |
| [Lombok](lombok)                              | Experimental | 1.5.20                   |              |
| [Power-assert](power-assert)                  | Experimental | 2.0.0                    |              |

### Kotlin 라이브러리

| **Component**         | **Status** | **Status since version** | **Comments** |
|-----------------------|------------|--------------------------|--------------|
| kotlin-stdlib (JVM)   | Stable     | 1.0.0                    |              |
| kotlinx-coroutines    | Stable     | 1.3.0                    |              |
| kotlinx-serialization | Stable     | 1.0.0                    |              |
| kotlin-metadata-jvm   | Stable     | 2.0.0                    |              |
| kotlin-reflect (JVM)  | Beta       | 1.0.0                    |              |
| kotlinx-datetime      | Alpha      | 0.2.0                    |              |
| kotlinx-io            | Alpha      | 0.2.0                    |              |

### Kotlin Multiplatform

| **Component**                                    | **Status**   | **Status since version** | **Comments**                                                               |
|--------------------------------------------------|--------------|--------------------------|----------------------------------------------------------------------------|
| Kotlin Multiplatform                             | Stable       | 1.9.20                   |                                                                            |
| Kotlin Multiplatform plugin for Android Studio   | Beta         | 0.8.0                    | [Versioned separately from the language](multiplatform-plugin-releases) |

### Kotlin/Native

| **Component**                                | **Status** | **Status since version** | **Comments**                            |
|----------------------------------------------|------------|--------------------------|-----------------------------------------|
| Kotlin/Native Runtime                        | Stable     | 1.9.20                   |                                         |
| Kotlin/Native interop with C and Objective-C | Beta       | 1.3.0                    |                                         |
| klib binaries                                | Stable     | 1.9.20                   | Not including cinterop klibs, see below |
| cinterop klib binaries                       | Beta       | 1.3.0                    |                                         |
| CocoaPods integration                        | Stable     | 1.9.20                   |                                         |

> Kotlin/Native 타겟 지원에 대한 자세한 내용은 [](native-target-support)을 참조하세요.

### 언어 도구

| **Component**                         | **Status**   | **Status since version** | **Comments**                                   |
|---------------------------------------|--------------|--------------------------|------------------------------------------------|
| Scripting syntax and semantics        | Alpha        | 1.2.0                    |                                                |
| Scripting embedding and extension API | Beta         | 1.5.0                    |                                                |
| Scripting IDE support                 | Beta         |                          | Available since IntelliJ IDEA 2023.1 and later |
| CLI scripting                         | Alpha        | 1.2.0                    |                                                |

## 언어 기능 및 디자인 제안

언어 기능 및 새로운 디자인 제안은 [](kotlin-language-features-and-proposals)을 참조하세요.