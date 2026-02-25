[//]: # (title: Kotlin Multiplatform 프로젝트 구성 선택하기)

기존 프로젝트에 Kotlin Multiplatform을 추가하거나 새로운 프로젝트를 시작할 때, 코드를 구조화하는 방법은 여러 가지가 있습니다. 일반적으로 하나 이상의 Kotlin Multiplatform 공유 모듈(shared module)을 생성하고, 이를 Android 및 iOS 앱에서 사용합니다.

귀하의 구체적인 상황에 가장 적합한 방식을 선택하려면 다음 질문들을 고려해 보세요:

* [Kotlin Multiplatform 모듈에서 생성된 iOS 프레임워크를 iOS 앱에서 어떻게 사용하나요?](#connect-a-kotlin-multiplatform-module-to-an-ios-app)
  직접 통합하나요, CocoaPods를 통하나요, 아니면 Swift Package Manager(SPM)를 사용하나요?
* [하나의 공유 모듈을 사용하나요, 아니면 여러 개를 사용하나요?](#module-configurations)
  여러 공유 모듈을 사용할 때 엄브렐러 모듈(umbrella module)은 무엇이어야 하나요?
* [모든 코드를 모노레포(monorepo)에 저장하나요, 아니면 서로 다른 저장소에 저장하나요?](#repository-configurations)
* [Kotlin Multiplatform 모듈 프레임워크를 로컬 의존성으로 사용하나요, 아니면 원격 의존성으로 사용하나요?](#code-sharing-workflow)

이 질문들에 대한 답변은 프로젝트에 가장 적합한 구성을 선택하는 데 도움이 될 것입니다.

## Kotlin Multiplatform 모듈을 iOS 앱에 연결하기

iOS 앱에서 Kotlin Multiplatform 공유 모듈을 사용하려면, 먼저 이 공유 모듈에서 [iOS 프레임워크](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)를 생성해야 합니다. 그런 다음 이를 iOS 프로젝트에 의존성으로 추가해야 합니다.

일반적으로 구현 방식에 따라 두 가지 옵션이 있습니다:

* 로컬 의존성(Local dependency): Kotlin 빌드가 iOS 빌드와 직접 상호작용합니다.
* 원격 의존성(Remote dependency): Kotlin 빌드가 iOS 프레임워크를 생성하고, 패키지 매니저를 사용하여 이를 iOS 프로젝트에 연결합니다.

iOS 통합을 위한 모든 가용한 옵션을 검토하려면 [iOS 통합 방법](multiplatform-ios-integration-overview.md)을 참조하세요.

## 모듈 구성

Kotlin Multiplatform 프로젝트에서 사용할 수 있는 두 가지 모듈 구성 옵션이 있습니다: 단일 모듈 또는 여러 개의 공유 모듈입니다.

### 단일 공유 모듈

가장 간단한 모듈 구성은 프로젝트에 단 하나의 공유 Kotlin Multiplatform 모듈만 포함하는 것입니다:

![단일 공유 모듈](single-shared-module.svg){width=700}

Android 앱은 공유 Kotlin Multiplatform 모듈을 일반적인 Kotlin 모듈처럼 의존성으로 가질 수 있습니다. 그러나 iOS는 Kotlin을 직접 사용할 수 없으므로, iOS 앱은 Kotlin Multiplatform 모듈에서 생성된 iOS 프레임워크에 의존해야 합니다.

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>
    <list>
       <li>단일 모듈을 사용하는 단순한 설계는 인지 부하를 줄여줍니다. 기능을 어디에 둘지 또는 논리적으로 어떻게 나눌지 고민할 필요가 없습니다.</li>
       <li>시작점으로 매우 훌륭합니다.</li>
</list>
</td>
<td>
<list>
  <li>공유 모듈이 커짐에 따라 컴파일 시간이 늘어납니다.</li>
  <li>이 설계로는 기능을 분리하거나 앱에 필요한 기능에만 의존성을 가지는 것이 불가능합니다.</li>
</list>
</td>
</tr>

</table>

### 여러 개의 공유 모듈

공유 모듈이 커지면 기능(feature) 모듈로 나누는 것이 좋습니다. 이는 단일 모듈 사용 시 발생할 수 있는 확장성 문제를 방지하는 데 도움이 됩니다.

Android 앱은 모든 기능 모듈에 직접 의존하거나, 필요에 따라 일부에만 의존할 수 있습니다.

iOS 앱은 Kotlin Multiplatform 모듈에서 생성된 하나의 프레임워크에 의존할 수 있습니다. 여러 모듈을 사용하는 경우, 사용하는 모든 모듈에 의존하는 추가 모듈이 필요한데 이를 _엄브렐러 모듈(umbrella module)_이라고 하며, 모든 모듈을 포함하는 프레임워크를 구성해야 하는데 이를 _엄브렐러 프레임워크(umbrella framework)_라고 합니다.

> 엄브렐러 프레임워크 번들은 프로젝트의 모든 공유 모듈을 포함하며 iOS 앱으로 임포트됩니다.
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
       <li>공유 코드에 대한 관심사 분리(Separation of concerns).</li>
       <li>더 나은 확장성.</li>
       </list>
</td>
<td>
<list>
  <li>엄브렐러 프레임워크 설정을 포함하여 설정이 더 복잡합니다.</li>
 <li>모듈 간 의존성 관리가 더 까다로워집니다.</li>
</list>
</td>
</tr>

</table>

엄브렐러 모듈을 설정하려면, 모든 기능 모듈에 의존하는 별도의 모듈을 추가하고 이 모듈에서 프레임워크를 생성합니다:

![엄브렐러 프레임워크](umbrella-framework.svg){width=700}

Android 앱은 일관성을 위해 엄브렐러 모듈에 의존하거나, 개별 기능 모듈에 의존할 수 있습니다. 엄브렐러 모듈에는 종종 유용한 유틸리티 함수와 의존성 주입(DI) 설정 코드가 포함됩니다.

일반적으로 프레임워크 아티팩트가 원격 의존성으로 사용될 때, 일부 모듈만 엄브렐러 프레임워크로 내보낼(export) 수 있습니다. 주된 이유는 자동 생성된 코드가 제외되도록 하여 최종 아티팩트의 크기를 줄이기 위함입니다.

엄브렐러 프레임워크 방식의 알려진 제약 사항은 iOS 앱이 기능 모듈 중 일부만 사용할 수 없으며, 모든 모듈을 자동으로 사용하게 된다는 점입니다. 이 기능에 대한 개선 사항을 제안하려면 [KT-42247](https://youtrack.jetbrains.com/issue/KT-42247) 및 [KT-42250](https://youtrack.jetbrains.com/issue/KT-42250)에 귀하의 사례를 설명해 주세요.

> 아래 예시에서 iOS 앱이 엄브렐러 모듈에 의존한다는 것은, 해당 모듈에서 생성된 엄브렐러 프레임워크에도 의존한다는 의미입니다.
>
{style="tip"}

#### 왜 엄브렐러 프레임워크가 필요한가요? {initial-collapse-state="collapsed" collapsible="true"}

서로 다른 Kotlin Multiplatform 공유 모듈에서 생성된 여러 프레임워크를 iOS 앱에 포함하는 것이 가능하긴 하지만, 이 방법은 권장하지 않습니다. Kotlin Multiplatform 모듈이 프레임워크로 컴파일될 때, 결과 프레임워크에는 모든 의존성이 포함됩니다. 둘 이상의 모듈이 동일한 의존성을 사용하고 iOS에 별도의 프레임워크로 노출되는 경우, Kotlin/Native 컴파일러는 의존성을 중복시킵니다.

이러한 중복은 여러 문제를 야기합니다. 첫째, iOS 앱 크기가 불필요하게 커집니다. 둘째, 한 의존성의 코드 구조가 중복된 의존성의 코드 구조와 호환되지 않습니다. 이는 iOS 애플리케이션 내에서 동일한 의존성을 가진 두 모듈을 통합하려고 할 때 문제를 일으킵니다. 예를 들어, 서로 다른 모듈이 동일한 의존성을 통해 전달하는 모든 상태가 서로 연결되지 않습니다. 이는 예상치 못한 동작과 버그로 이어질 수 있습니다. 정확한 제한 사항에 대한 자세한 내용은 [TouchLab 문서](https://touchlab.co/multiple-kotlin-frameworks-in-application/)를 참조하세요.

Kotlin은 공통 프레임워크 의존성을 생성하지 않는데, 그 이유는 중복이 발생할 수 있고 앱에 추가하는 모든 Kotlin 바이너리는 가능한 한 작아야 하기 때문입니다. 전체 Kotlin 런타임과 모든 의존성의 코드를 모두 포함하는 것은 낭비입니다. Kotlin 컴파일러는 특정 빌드에 정확히 필요한 만큼만 바이너리를 다듬을 수 있습니다. 그러나 다른 빌드에 무엇이 필요할지 알 수 없으므로 의존성을 공유하는 것은 실현 불가능합니다. 저희는 이 문제의 영향을 최소화하기 위한 다양한 옵션을 탐색하고 있습니다.

이 문제의 해결책은 엄브렐러 프레임워크를 사용하는 것입니다. 이는 중복된 의존성으로 인해 iOS 앱이 비대해지는 것을 방지하고, 결과 아티팩트를 최적화하는 데 도움을 주며, 의존성 간의 불호환성으로 인한 문제를 제거합니다.

## 저장소 구성

기존 또는 새로운 Kotlin Multiplatform 프로젝트에서 하나의 저장소 또는 여러 저장소의 조합을 사용하는 다양한 저장소 구성 옵션이 있습니다.

### 모노레포: 모든 것을 하나의 저장소에

일반적인 저장소 구성을 모노레포(monorepo) 구성이라고 합니다. 이 방식은 Kotlin Multiplatform 샘플 및 튜토리얼에서 사용됩니다. 이 경우 저장소에는 Android 및 iOS 앱뿐만 아니라 엄브렐러 모듈을 포함한 공유 모듈들이 포함됩니다:

![모노레포 구성 1](monorepo-configuration-1.svg){width=700}

![모노레포 구성 2](monorepo-configuration-2.svg){width=700}

일반적으로 iOS 앱은 직접 통합 또는 CocoaPods 통합을 사용하여 Kotlin Multiplatform 공유 모듈을 일반 프레임워크처럼 사용합니다. 자세한 내용과 튜토리얼 링크는 [Kotlin Multiplatform 모듈을 iOS 앱에 연결하기](#connect-a-kotlin-multiplatform-module-to-an-ios-app)를 참조하세요.

저장소가 버전 관리 하에 있다면 앱과 공유 모듈은 동일한 버전을 갖게 됩니다.

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>
    <list>
       <li>위저드(wizard)의 도움으로 설정하기 쉽습니다.</li>
       <li>모든 코드가 동일한 저장소에 위치하므로 iOS 개발자가 Kotlin Multiplatform 코드를 쉽게 다룰 수 있습니다.</li>
</list>
</td>
<td>
<list>
  <li>iOS 개발자가 생소한 도구들을 설치하고 설정해야 합니다.</li>
<li>이 방식은 이미 서로 다른 저장소에 저장된 기존 앱들에는 적용하기 어려운 경우가 많습니다.</li>
</list>
</td>
</tr>

</table>

기존 Android 및 iOS 앱이 이미 서로 다른 저장소에 저장되어 있는 경우, 이들을 병합하는 대신 Kotlin Multiplatform 부분을 Android 저장소나 별도의 저장소에 추가할 수 있습니다.

### 두 개의 저장소: Android + 공유 | iOS

또 다른 프로젝트 구성은 두 개의 저장소를 갖는 것입니다. 이 경우 Kotlin Multiplatform 저장소에는 Android 앱과 엄브렐러 모듈을 포함한 공유 모듈이 포함되며, Xcode 프로젝트에는 iOS 앱이 포함됩니다:

![두 개의 저장소 구성](two-repositories.svg){width=700}

Android 및 iOS 앱은 별도로 버전을 관리할 수 있으며, 공유 모듈은 Android 앱과 함께 버전이 관리됩니다.

### 세 개의 저장소: Android | iOS | 공유

또 다른 옵션은 Kotlin Multiplatform 모듈을 위한 별도의 저장소를 갖는 것입니다. 이 경우 Android 및 iOS 앱은 별도의 저장소에 저장되며, 프로젝트의 공유 코드는 여러 기능 모듈과 iOS를 위한 엄브렐러 모듈을 포함할 수 있습니다:

![세 개의 저장소 구성](three-repositories.svg){width=700}

각 프로젝트는 별도로 버전을 관리할 수 있습니다. Kotlin Multiplatform 모듈 역시 Android 또는 JVM 플랫폼을 위해 버전을 관리하고 게시(publish)해야 합니다. 기능 모듈을 독립적으로 게시하거나, 엄브렐러 모듈만 게시하고 Android 앱이 이에 의존하도록 할 수 있습니다.

Android 아티팩트를 별도로 게시하는 것은 Kotlin Multiplatform 모듈이 Android 프로젝트의 일부인 경우에 비해 Android 개발자에게 추가적인 복잡성을 줄 수 있습니다.

Android와 iOS 팀 모두가 동일한 버전의 아티팩트를 사용할 때, 그들은 동일한 버전 상태(version parity)에서 운영됩니다. 팀 관점에서 이는 공유 Kotlin Multiplatform 코드가 Android 개발자의 "소유"라는 인상을 피하게 해줍니다. 기능 개발을 위해 이미 버전이 관리되는 내부 Kotlin 및 Swift 패키지를 게시하고 있는 대규모 프로젝트의 경우, 공유 Kotlin 아티팩트를 게시하는 것은 기존 워크플로의 일부가 됩니다.

### 다중 저장소: Android | iOS | 다수 라이브러리

여러 플랫폼의 여러 앱 간에 기능을 공유해야 하는 경우, Kotlin Multiplatform 코드가 포함된 여러 저장소를 갖는 것을 선호할 수 있습니다. 예를 들어, 제품 전체에서 공통으로 사용되는 로깅 라이브러리를 자체 버전을 가진 별도의 저장소에 저장할 수 있습니다.

이 경우 여러 개의 Kotlin Multiplatform 라이브러리 저장소를 갖게 됩니다. 여러 iOS 앱이 "라이브러리 프로젝트"의 서로 다른 하위 집합을 사용하는 경우, 각 앱은 라이브러리 프로젝트에 필요한 의존성을 포함하는 엄브렐러 모듈이 있는 추가 저장소를 가질 수 있습니다:

![다중 저장소 구성](many-repositories.svg){width=700}

여기서 각 라이브러리는 Android 또는 JVM 플랫폼을 위해서도 버전을 관리하고 게시해야 합니다. 앱과 각 라이브러리는 별도로 버전을 관리할 수 있습니다.

## 코드 공유 워크플로

iOS 앱은 Kotlin Multiplatform 공유 모듈에서 생성된 프레임워크를 _로컬_ 또는 _원격_ 의존성으로 사용할 수 있습니다. iOS 빌드에서 프레임워크에 대한 로컬 경로를 제공하여 로컬 의존성을 사용할 수 있습니다. 이 경우 프레임워크를 게시할 필요가 없습니다. 또는 프레임워크가 포함된 아티팩트를 어딘가에 게시하고, 다른 써드파티 의존성처럼 iOS 앱이 이를 원격 의존성으로 사용하게 할 수 있습니다.

### 로컬: 소스 배포

로컬 배포는 iOS 앱이 게시 과정 없이 Kotlin Multiplatform 모듈 프레임워크를 사용하는 방식입니다. iOS 앱은 프레임워크를 직접 통합하거나 CocoaPods를 사용하여 통합할 수 있습니다.

이 워크플로는 일반적으로 Android와 iOS 팀 구성원 모두가 공유 Kotlin Multiplatform 코드를 편집하고 싶어 할 때 사용됩니다. iOS 개발자는 IntelliJ IDEA 또는 Android Studio를 설치해야 하며 Kotlin 및 Gradle에 대한 기본 지식이 있어야 합니다.

로컬 배포 방식에서는 iOS 앱 빌드가 iOS 프레임워크 생성을 트리거합니다. 즉, iOS 개발자는 Kotlin Multiplatform 코드에 대한 변경 사항을 즉시 확인할 수 있습니다:

![로컬 소스 배포](local-source-distribution.svg){width=700}

이 시나리오는 보통 두 가지 경우에 사용됩니다. 첫째, 아티팩트를 게시할 필요 없이 모노레포 프로젝트 구성에서 기본 워크플로로 사용될 수 있습니다. 둘째, 원격 워크플로와 병행하여 로컬 개발용으로 사용될 수 있습니다. 자세한 내용은 [로컬 개발을 위한 로컬 의존성 설정하기](#setting-up-a-local-dependency-for-local-development)를 참조하세요.

이 워크플로는 모든 팀 구성원이 전체 프로젝트의 코드를 편집할 준비가 되었을 때 가장 효과적입니다. 공통 부분을 변경한 후 Android 및 iOS 앱을 모두 열고 실행할 수 있도록 모든 팀원이 IntelliJ IDEA/Android Studio와 Xcode를 모두 설치하는 것이 이상적입니다.

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>
    <list>
       <li>Android와 iOS 팀 구성원 모두가 Kotlin Multiplatform 코드를 쉽게 편집할 수 있어, 공유 코드의 생성 및 유지 관리가 공동의 책임이 됩니다. 이는 팀 간의 고립을 방지하고 협업을 장려합니다.</li>
       <li>공유 코드에 대해 별도의 버전 관리 및 게시가 필요하지 않습니다.</li>
       <li>iOS 팀 구성원이 아티팩트가 생성되고 게시될 때까지 기다릴 필요가 없으므로 개발 워크플로가 더 빠릅니다.</li>
   </list>
</td>
<td>
  <list>
    <li>팀 구성원들이 각자의 머신에 전체 개발 환경을 구축해야 합니다.</li>
    <li>iOS 개발자가 IntelliJ IDEA 또는 Android Studio 및 Gradle 사용법을 배워야 합니다.</li>
    <li>공유되는 코드가 많아지고 팀이 커짐에 따라 변경 사항 관리가 어려워질 수 있습니다.</li>
  </list>
</td>
</tr>

</table>

### 원격: 아티팩트 배포

원격 배포는 프레임워크 아티팩트가 Swift Package Manager 또는 CocoaPod으로 게시되고 iOS 앱에서 이를 사용하는 것을 의미합니다. Android 앱은 바이너리 의존성을 로컬 또는 원격으로 사용할 수 있습니다.

원격 배포는 종종 기존 프로젝트에 기술을 점진적으로 도입하기 위해 사용됩니다. 이는 iOS 개발자의 워크플로와 빌드 프로세스를 크게 변화시키지 않습니다. 두 개 이상의 저장소를 가진 팀은 주로 원격 배포를 사용하여 프로젝트 코드를 저장합니다.

시작 단계에서 [KMMBridge](https://touchlab.co/trykmmbridge)를 사용하는 것이 좋습니다. 이는 원격 배포 워크플로를 크게 단순화하는 빌드 도구 모음입니다. 또는 언제든지 이와 유사한 워크플로를 직접 설정할 수 있습니다:

![원격 아티팩트 배포](remote-artifact-distribution.svg){width=700}

<table>
  
<tr>
<th>장점</th>
     <th>단점</th>
</tr>

  
<tr>
<td>참여하지 않는 iOS 팀 구성원이 Kotlin으로 코딩하거나 IntelliJ IDEA/Android Studio, Gradle과 같은 도구의 사용법을 배울 필요가 없습니다. 이는 팀의 진입 장벽을 크게 낮춰줍니다.</td>
<td>
  <list>
    <li>공유 코드를 편집하고 빌드하는 과정에 게시 및 버전 관리가 포함되므로 iOS 개발자의 워크플로가 느려집니다.</li>
   <li>iOS에서 공유 Kotlin 코드를 디버깅하기 어렵습니다.</li>
   <li>iOS 팀 구성원이 공유 코드에 기여할 가능성이 크게 줄어듭니다.</li>
   <li>공유 코드의 유지 관리는 전적으로 참여하는 팀 구성원들의 몫이 됩니다.</li>
  </list>
</td>
</tr>

</table>

#### 로컬 개발을 위한 로컬 의존성 설정하기

많은 팀이 Kotlin Multiplatform 기술을 채택할 때 iOS 개발자의 개발 프로세스를 동일하게 유지하기 위해 원격 배포 워크플로를 선택합니다. 하지만 이 워크플로에서는 Kotlin Multiplatform 코드를 변경하기가 어렵습니다. 저희는 Kotlin Multiplatform 모듈에서 생성된 프레임워크에 대한 로컬 의존성을 갖는 추가적인 "로컬 개발" 워크플로를 설정할 것을 권장합니다.

개발자가 새로운 기능을 추가할 때는 Kotlin Multiplatform 모듈을 로컬 의존성으로 사용하도록 전환합니다. 이를 통해 공통 Kotlin 코드를 변경하고, iOS에서 즉시 동작을 관찰하며, Kotlin 코드를 디버깅할 수 있습니다. 기능이 완성되면 다시 원격 의존성으로 전환하고 변경 사항을 적절히 게시할 수 있습니다. 먼저 공유 모듈의 변경 사항을 게시한 후에 앱을 변경합니다.

원격 배포 워크플로의 경우 Swift Package Manager를 사용하세요. 로컬 배포 워크플로의 경우 프레임워크를 직접 통합하세요.

<!-- 이 튜토리얼 [TODO]은 Xcode에서 해당 스키마를 선택하여 워크플로를 전환하는 방법을 설명합니다:
[TODO 스크린샷] -->

CocoaPods를 사용하는 경우, 로컬 배포 워크플로에 CocoaPods를 대신 사용할 수 있습니다. [TouchLab 문서](https://touchlab.co/kmmbridgecocoapodslocal)에 설명된 대로 환경 변수를 변경하여 두 방식 사이를 전환할 수 있습니다.