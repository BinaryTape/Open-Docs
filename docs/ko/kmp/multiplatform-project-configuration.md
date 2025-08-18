[//]: # (title: Kotlin Multiplatform 프로젝트 구성 선택하기)

기존 프로젝트에 Kotlin Multiplatform을 추가하거나 새 프로젝트를 시작할 때 코드를 구조화하는 다양한 방법이 있습니다. 일반적으로 하나 이상의 Kotlin Multiplatform 공유 모듈을 생성하고 이를 Android 및 iOS 앱에서 사용합니다.

특정 상황에 가장 적합한 접근 방식을 선택하려면 다음 질문을 고려하세요:

* [Kotlin Multiplatform 모듈이 생성한 iOS 프레임워크를 iOS 앱에서 어떻게 사용하나요?](#connect-a-kotlin-multiplatform-module-to-an-ios-app)
  직접 통합하나요, CocoaPods를 통해서 통합하나요, 아니면 Swift Package Manager (SPM)를 사용하나요?
* [하나 또는 여러 개의 Kotlin Multiplatform 공유 모듈을 가지고 있나요?](#module-configurations)
  여러 공유 모듈에 대한 엄브렐러 모듈은 무엇이어야 할까요?
* [모든 코드를 모노레포에 저장하나요 아니면 다른 저장소에 저장하나요?](#repository-configurations)
* [Kotlin Multiplatform 모듈 프레임워크를 로컬 또는 원격 종속성으로 사용하나요?](#code-sharing-workflow)

이 질문들에 답하면 프로젝트에 가장 적합한 구성을 선택하는 데 도움이 될 것입니다.

## Kotlin Multiplatform 모듈을 iOS 앱에 연결하기

iOS 앱에서 Kotlin Multiplatform 공유 모듈을 사용하려면 먼저 이 공유 모듈에서 [iOS 프레임워크](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)를 생성해야 합니다. 그런 다음, 이를 iOS 프로젝트에 종속성으로 추가해야 합니다:

![Kotlin Multiplatform 공유 모듈](kmp-shared-module.svg){width=700}

이 프레임워크는 로컬 또는 원격 종속성으로 사용할 수 있습니다.

다음 방법 중 하나로 iOS 프로젝트에 Kotlin Multiplatform 모듈 프레임워크에 대한 종속성을 추가할 수 있습니다:

* **직접 통합(Direct integration)**. iOS 앱 빌드에 새 빌드 스크립트 단계를 추가하여 프레임워크를 직접 연결합니다. Xcode에서 이를 수행하는 방법을 알아보려면 [프레임워크를 iOS 프로젝트에 연결하기](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)를 참조하세요.

  Android Studio 위저드로 프로젝트를 생성할 때, 이 설정을 자동으로 생성하려면 **일반 프레임워크(Regular framework)** 옵션을 선택하세요.

* **CocoaPods 통합(CocoaPods integration)**. Swift 및 Objective-C 프로젝트의 인기 있는 종속성 관리자인 [CocoaPods](https://cocoapods.org/)를 통해 프레임워크를 연결합니다. 이는 로컬 또는 원격 종속성일 수 있습니다. 자세한 내용은 [Kotlin Gradle 프로젝트를 CocoaPods 종속성으로 사용하기](multiplatform-cocoapods-xcode.md)를 참조하세요.

  로컬 CocoaPods 종속성을 사용하는 워크플로를 설정하려면 위저드로 프로젝트를 생성하거나 스크립트를 수동으로 편집할 수 있습니다.

* **SPM 사용**. Swift 코드 배포를 관리하는 Apple 도구인 Swift Package Manager (SPM)를 사용하여 프레임워크를 연결합니다. 저희는 [SPM 공식 지원을 위해 노력 중입니다](https://youtrack.jetbrains.com/issue/KT-53877). 현재는 XCFrameworks를 사용하여 Swift 패키지에 대한 종속성을 설정할 수 있습니다. 자세한 내용은 [Swift 패키지 내보내기 설정](multiplatform-spm-export.md)을 참조하세요.

## 모듈 구성

Kotlin Multiplatform 프로젝트에서 사용할 수 있는 모듈 구성 옵션은 단일 모듈과 여러 공유 모듈 두 가지가 있습니다.

### 단일 공유 모듈

가장 간단한 모듈 구성은 프로젝트에 단일 공유 Kotlin Multiplatform 모듈만 포함합니다:

![단일 공유 모듈](single-shared-module.svg){width=700}

Android 앱은 일반 Kotlin 모듈처럼 Kotlin Multiplatform 공유 모듈에 종속될 수 있습니다. 그러나 iOS는 Kotlin을 직접 사용할 수 없으므로, iOS 앱은 Kotlin Multiplatform 모듈이 생성한 iOS 프레임워크에 종속되어야 합니다.

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>
    <list>
       <li>단일 모듈로 구성된 간단한 디자인은 인지 부하를 줄여줍니다. 기능을 어디에 배치하거나 논리적으로 어떻게 분할할지 고민할 필요가 없습니다.</li>
       <li>시작점으로 훌륭하게 작동합니다.</li>
</list>
</td>
<td>
<list>
  <li>공유 모듈이 커질수록 컴파일 시간이 증가합니다.</li>
  <li>이 디자인은 기능을 분리하거나 앱에 필요한 기능에만 종속성을 갖는 것을 허용하지 않습니다.</li>
</list>
</td>
</tr>

</table>

### 여러 공유 모듈

공유 모듈이 커짐에 따라 이를 기능 모듈로 분할하는 것이 좋습니다. 이는 단일 모듈을 가질 때 발생할 수 있는 확장성 문제를 피하는 데 도움이 됩니다.

Android 앱은 모든 기능 모듈에 직접 종속될 수 있으며, 필요한 경우 일부에만 종속될 수 있습니다.

iOS 앱은 Kotlin Multiplatform 모듈이 생성한 하나의 프레임워크에 종속될 수 있습니다. 여러 모듈을 사용하는 경우, 사용하는 모든 모듈에 종속되는 추가 모듈인 _엄브렐러 모듈(umbrella module)_을 추가해야 하며, 그 다음 모든 모듈을 포함하는 프레임워크인 _엄브렐러 프레임워크(umbrella framework)_를 구성해야 합니다.

> 엄브렐러 프레임워크 번들은 프로젝트의 모든 공유 모듈을 포함하며 iOS 앱으로 가져와집니다.
>
{style="tip"}

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>
    <list>
       <li>공유 코드의 관심사 분리(Separation of concerns).</li>
       <li>더 나은 확장성.</li>
       </list>
</td>
<td>
<list>
  <li>엄브렐러 프레임워크 설정을 포함하여 더 복잡한 설정.</li>
 <li>모듈 간의 더 복잡한 종속성 관리.</li>
</list>
</td>
</tr>

</table>

엄브렐러 모듈을 설정하려면 모든 기능 모듈에 종속되는 별도의 모듈을 추가하고 이 모듈에서 프레임워크를 생성합니다:

![엄브렐러 프레임워크](umbrella-framework.svg){width=700}

Android 앱은 일관성을 위해 엄브렐러 모듈에 종속되거나 별도의 기능 모듈에 종속될 수 있습니다. 엄브렐러 모듈은 종종 유용한 유틸리티 함수와 의존성 주입(dependency injection) 설정 코드를 포함합니다.

일반적으로 프레임워크 아티팩트가 원격 종속성으로 사용될 때, 일부 모듈만 엄브렐러 프레임워크로 내보낼 수 있습니다. 주요 이유는 자동 생성된 코드를 제외하여 최종 아티팩트의 크기를 줄이는 것입니다.

엄브렐러 프레임워크 접근 방식의 알려진 제약 사항은 iOS 앱이 일부 기능 모듈만 사용할 수 없다는 것입니다. iOS 앱은 자동으로 모든 모듈을 사용합니다. 이 기능에 대한 개선 가능성을 위해, [KT-42247](https://youtrack.jetbrains.com/issue/KT-42247) 및 [KT-42250](https://youtrack.jetbrains.com/issue/KT-42250)에 귀하의 사례를 설명해주세요.

> 아래 예시에서 iOS 앱이 엄브렐러 모듈에 종속된다는 것을 볼 때, 이는 이 모듈에서 생성된 엄브렐러 프레임워크에도 종속된다는 것을 의미합니다.
>
{style="tip"}

#### 엄브렐러 프레임워크가 필요한 이유는 무엇인가요? {initial-collapse-state="collapsed" collapsible="true"}

iOS 앱에 서로 다른 Kotlin Multiplatform 공유 모듈에서 생성된 여러 프레임워크를 포함할 수 있지만, 이 방법은 권장하지 않습니다. Kotlin Multiplatform 모듈이 프레임워크로 컴파일되면, 결과 프레임워크는 모든 종속성을 포함합니다. 두 개 이상의 모듈이 동일한 종속성을 사용하고 별도의 프레임워크로 iOS에 노출될 때마다, Kotlin/Native 컴파일러는 해당 종속성을 중복시킵니다.

이러한 중복은 여러 문제를 야기합니다. 첫째, iOS 앱 크기가 불필요하게 커집니다. 둘째, 한 종속성의 코드 구조가 중복된 종속성의 코드 구조와 호환되지 않습니다. 이는 iOS 애플리케이션 내에서 동일한 종속성을 가진 두 모듈을 통합하려고 할 때 문제를 발생시킵니다. 예를 들어, 서로 다른 모듈이 동일한 종속성을 통해 전달하는 모든 상태는 연결되지 않습니다. 이는 예상치 못한 동작과 버그로 이어질 수 있습니다. 정확한 제한 사항에 대한 자세한 내용은 [TouchLab 문서](https://touchlab.co/multiple-kotlin-frameworks-in-application/)를 참조하세요.

Kotlin은 공통 프레임워크 종속성을 생성하지 않습니다. 그렇지 않으면 중복이 발생하고, 앱에 추가하는 모든 Kotlin 바이너리는 가능한 한 작아야 하기 때문입니다. 전체 Kotlin 런타임과 모든 종속성의 모든 코드를 포함하는 것은 낭비입니다. Kotlin 컴파일러는 특정 빌드에 필요한 만큼 정확히 바이너리를 정리할 수 있습니다. 그러나 다른 빌드에 무엇이 필요할지는 알지 못하므로 종속성을 공유하려고 시도하는 것은 비실용적입니다. 이 문제의 영향을 최소화하기 위한 다양한 옵션을 모색 중입니다.

이 문제에 대한 해결책은 엄브렐러 프레임워크를 사용하는 것입니다. 이는 iOS 앱이 중복된 종속성으로 인해 비대해지는 것을 방지하고, 결과 아티팩트를 최적화하며, 종속성 간의 비호환성으로 인한 불편함을 없애줍니다.

## 저장소 구성

새로운 Kotlin Multiplatform 프로젝트와 기존 프로젝트에서 사용할 수 있는 다양한 저장소 구성 옵션이 있습니다. 이는 단일 저장소를 사용하거나 여러 저장소를 조합하는 방식입니다.

### 모노레포(Monorepo): 모든 것을 하나의 저장소에

일반적인 저장소 구성은 모노레포(monorepo) 구성이라고 불립니다. 이 접근 방식은 Kotlin Multiplatform 샘플 및 튜토리얼에서 사용됩니다. 이 경우 저장소에는 Android 및 iOS 앱과 엄브렐러 모듈을 포함한 공유 모듈 또는 여러 모듈이 모두 포함됩니다:

![모노레포 구성](monorepo-configuration-1.svg){width=700}

![모노레포 구성](monorepo-configuration-2.svg){width=700}

일반적으로 iOS 앱은 직접 통합 또는 CocoaPods 통합을 사용하여 Kotlin Multiplatform 공유 모듈을 일반 프레임워크로 사용합니다. 자세한 내용과 튜토리얼 링크는 [Kotlin Multiplatform 모듈을 iOS 앱에 연결하기](#connect-a-kotlin-multiplatform-module-to-an-ios-app)를 참조하세요.

저장소가 버전 관리 중이라면, 앱과 공유 모듈은 동일한 버전을 갖습니다.

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>
    <list>
       <li>위저드를 통해 쉽게 설정할 수 있습니다.</li>
       <li>모든 코드가 동일한 저장소에 있으므로 iOS 개발자는 Kotlin Multiplatform 코드로 쉽게 작업할 수 있습니다.</li>
</list>
</td>
<td>
<list>
  <li>iOS 개발자는 익숙하지 않은 도구를 설정하고 구성해야 합니다.</li>
<li>이 접근 방식은 이미 다른 저장소에 저장된 기존 앱에는 종종 작동하지 않습니다.</li>
</list>
</td>
</tr>

</table>

기존 Android 및 iOS 앱이 이미 다른 저장소에 저장되어 있는 경우, 이들을 병합하는 대신 Kotlin Multiplatform 부분을 Android 저장소에 추가하거나 별도의 저장소에 추가할 수 있습니다.

### 두 개의 저장소: Android + 공유 | iOS

또 다른 프로젝트 구성은 두 개의 저장소를 갖는 것입니다. 이 경우, Kotlin Multiplatform 저장소는 Android 앱과 엄브렐러 모듈을 포함한 공유 모듈을 모두 포함하며, Xcode 프로젝트는 iOS 앱을 포함합니다:

![두 개의 저장소 구성](two-repositories.svg){width=700}

Android 및 iOS 앱은 별도로 버전 관리될 수 있으며, 공유 모듈은 Android 앱과 함께 버전 관리됩니다.

### 세 개의 저장소: Android | iOS | 공유

또 다른 옵션은 Kotlin Multiplatform 모듈을 위한 별도의 저장소를 갖는 것입니다. 이 경우, Android 및 iOS 앱은 별도의 저장소에 저장되며, 프로젝트의 공유 코드는 여러 기능 모듈과 iOS용 엄브렐러 모듈을 포함할 수 있습니다:

![세 개의 저장소 구성](three-repositories.svg){width=700}

각 프로젝트는 별도로 버전 관리될 수 있습니다. Kotlin Multiplatform 모듈도 버전 관리되어 Android 또는 JVM 플랫폼용으로 게시되어야 합니다. 기능 모듈을 독립적으로 게시하거나 엄브렐러 모듈만 게시하고 Android 앱이 이에 종속되도록 할 수 있습니다.

Android 아티팩트를 별도로 게시하는 것은 Kotlin Multiplatform 모듈이 Android 프로젝트의 일부인 프로젝트 시나리오에 비해 Android 개발자에게 추가적인 복잡성을 야기할 수 있습니다.

Android 및 iOS 팀 모두 동일하게 버전 관리된 아티팩트를 사용할 때, 이들은 버전 동등성(version parity) 상태로 작동합니다. 팀 관점에서 이는 공유 Kotlin Multiplatform 코드가 Android 개발자들에게 "소유"된 것처럼 보이는 인상을 피할 수 있습니다. 기능 개발을 위해 이미 버전 관리된 내부 Kotlin 및 Swift 패키지를 게시하는 대규모 프로젝트의 경우, 공유 Kotlin 아티팩트를 게시하는 것이 기존 워크플로의 일부가 됩니다.

### 여러 저장소: Android | iOS | 여러 라이브러리

여러 플랫폼의 여러 앱 간에 기능이 공유되어야 할 때, Kotlin Multiplatform 코드를 사용하여 여러 저장소를 갖는 것을 선호할 수 있습니다. 예를 들어, 전체 제품에 공통적인 로깅 라이브러리를 자체 버전 관리와 함께 별도의 저장소에 저장할 수 있습니다.

이 경우, 여러 Kotlin Multiplatform 라이브러리 저장소를 갖게 됩니다. 여러 iOS 앱이 "라이브러리 프로젝트"의 다른 하위 집합을 사용하는 경우, 각 앱은 라이브러리 프로젝트에 대한 필요한 종속성을 포함하는 엄브렐러 모듈을 포함하는 추가 저장소를 가질 수 있습니다:

![여러 저장소 구성](many-repositories.svg){width=700}

여기서 각 라이브러리도 Android 또는 JVM 플랫폼용으로 버전 관리되고 게시되어야 합니다. 앱과 각 라이브러리는 별도로 버전 관리될 수 있습니다.

## 코드 공유 워크플로

iOS 앱은 Kotlin Multiplatform 공유 모듈에서 생성된 프레임워크를 _로컬(local)_ 또는 _원격(remote)_ 종속성으로 사용할 수 있습니다. 로컬 종속성을 사용하려면 iOS 빌드에서 프레임워크의 로컬 경로를 제공하면 됩니다. 이 경우 프레임워크를 게시할 필요가 없습니다. 또는, 프레임워크를 포함하는 아티팩트를 어딘가에 게시하고 iOS 앱이 다른 타사 종속성처럼 원격 종속성으로 사용하도록 할 수 있습니다.

### 로컬: 소스 배포

로컬 배포는 iOS 앱이 게시할 필요 없이 Kotlin Multiplatform 모듈 프레임워크를 사용하는 방식입니다. iOS 앱은 프레임워크를 직접 통합하거나 CocoaPods를 사용하여 통합할 수 있습니다.

이 워크플로는 일반적으로 Android 및 iOS 팀 구성원 모두 공유 Kotlin Multiplatform 코드를 편집하려는 경우에 사용됩니다. iOS 개발자는 Android Studio를 설치하고 Kotlin 및 Gradle에 대한 기본적인 지식이 있어야 합니다.

로컬 배포 방식에서는 iOS 앱 빌드가 iOS 프레임워크 생성을 트리거합니다. 이는 iOS 개발자가 Kotlin Multiplatform 코드에 대한 변경 사항을 즉시 확인할 수 있음을 의미합니다:

![로컬 소스 배포](local-source-distribution.svg){width=700}

이 시나리오는 일반적으로 두 가지 경우에 사용됩니다. 첫째, 아티팩트를 게시할 필요 없이 모노레포 프로젝트 구성에서 기본 워크플로로 사용될 수 있습니다. 둘째, 원격 워크플로 외에 로컬 개발용으로 사용될 수 있습니다. 자세한 내용은 [로컬 개발을 위한 로컬 종속성 설정](#setting-up-a-local-dependency-for-local-development)을 참조하세요.

이 워크플로는 모든 팀 구성원이 전체 프로젝트의 코드를 편집할 준비가 되어 있을 때 가장 효과적입니다. 여기에는 공통 부분에 변경 사항을 적용한 후 Android 및 iOS 부분 모두에 대한 작업이 포함됩니다. 이상적으로는 모든 팀 구성원이 공통 코드에 변경 사항을 적용한 후 두 앱을 모두 열고 실행할 수 있도록 Android Studio와 Xcode가 설치되어 있어야 합니다.

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>
    <list>
       <li>Android 및 iOS 팀 구성원 모두 Kotlin Multiplatform 코드를 쉽게 편집할 수 있으므로, 공유 코드의 생성 및 유지보수가 공동의 책임이 됩니다. 이는 팀 간의 고립을 방지하고 협업을 장려합니다.</li>
       <li>이 접근 방식은 공유 코드의 별도 버전 관리 및 게시를 요구하지 않습니다.</li>
       <li>iOS 팀 구성원이 아티팩트가 생성되고 게시될 때까지 기다릴 필요가 없으므로 개발 워크플로가 더 빠릅니다.</li>
   </list>
</td>
<td>
  <list>
    <li>팀 구성원은 자신의 머신에 완전한 개발 환경을 설정해야 합니다.</li>
    <li>iOS 개발자는 Android Studio와 Gradle 사용법을 배워야 합니다.</li>
    <li>더 많은 코드가 공유되고 팀이 커짐에 따라 변경 사항 관리가 어려워집니다.</li>
  </list>
</td>
</tr>

</table>

### 원격: 아티팩트 배포

원격 배포는 프레임워크 아티팩트가 CocoaPod 또는 SPM을 사용하는 Swift 패키지로 게시되어 iOS 앱에서 사용되는 것을 의미합니다. Android 앱은 바이너리 종속성을 로컬 또는 원격으로 사용할 수 있습니다.

원격 배포는 기존 프로젝트에 기술을 점진적으로 도입하는 데 자주 사용됩니다. 이는 iOS 개발자를 위한 워크플로 및 빌드 프로세스를 크게 변경하지 않습니다. 두 개 이상의 저장소를 가진 팀은 주로 원격 배포를 사용하여 프로젝트 코드를 저장합니다.

시작점으로, 원격 배포 워크플로를 크게 단순화하는 빌드 도구 모음인 [KMMBridge](https://touchlab.co/trykmmbridge)를 사용하는 것을 고려할 수 있습니다. 또는 언제든지 유사한 워크플로를 직접 설정할 수도 있습니다:

![원격 아티팩트 배포](remote-artifact-distribution.svg){width=700}

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>프로젝트에 참여하지 않는 iOS 팀 구성원은 Kotlin 코드를 작성하거나 Android Studio 및 Gradle과 같은 도구 사용법을 배울 필요가 없습니다. 이는 팀의 진입 장벽을 크게 낮춥니다.</td>
<td>
  <list>
    <li>공유 코드 편집 및 빌드 프로세스에 게시 및 버전 관리가 포함되므로 iOS 개발자의 워크플로가 더 느립니다.</li>
   <li>iOS에서 공유 Kotlin 코드 디버깅이 어렵습니다.</li>
   <li>iOS 팀 구성원이 공유 코드에 기여할 가능성이 크게 줄어듭니다.</li>
   <li>공유 코드의 유지보수는 전적으로 참여 팀 구성원에게 달려 있습니다.</li>
  </list>
</td>
</tr>

</table>

#### 로컬 개발을 위한 로컬 종속성 설정

많은 팀이 Kotlin Multiplatform 기술을 채택할 때 iOS 개발자를 위한 개발 프로세스를 동일하게 유지하기 위해 원격 배포 워크플로를 선택합니다. 그러나 이 워크플로에서는 Kotlin Multiplatform 코드를 변경하기 어렵습니다.

Kotlin Multiplatform 모듈에서 생성된 프레임워크에 대한 로컬 종속성을 사용하여 추가 "로컬 개발" 워크플로를 설정하는 것을 권장합니다.

개발자가 새로운 기능을 추가할 때, Kotlin Multiplatform 모듈을 로컬 종속성으로 사용하는 방식으로 전환합니다. 이를 통해 공통 Kotlin 코드를 변경하고, iOS에서 동작을 즉시 확인하며, Kotlin 코드를 디버깅할 수 있습니다. 기능이 준비되면 원격 종속성으로 다시 전환하고 그에 따라 변경 사항을 게시할 수 있습니다. 먼저 공유 모듈에 대한 변경 사항을 게시한 후에야 앱에 변경 사항을 적용합니다.

원격 배포 워크플로의 경우 CocoaPods 통합 또는 SPM을 사용합니다. 로컬 배포 워크플로의 경우 프레임워크를 직접 통합합니다.

<!-- 이 튜토리얼은 [TODO] Xcode에서 해당 스키마를 선택하여 워크플로를 전환하는 방법을 설명합니다:
[TODO 스크린샷] -->

CocoaPods를 사용하는 경우, 로컬 배포 워크플로에 CocoaPods를 사용할 수도 있습니다. [TouchLab 문서](https://touchlab.co/kmmbridgecocoapodslocal)에 설명된 대로 환경 변수를 변경하여 전환할 수 있습니다.