---
title: "Kotlin 코드 스타일로 마이그레이션"
---
## Kotlin 코딩 컨벤션 및 IntelliJ IDEA 포맷터

[Kotlin 코딩 컨벤션](coding-conventions)은 관용적인 Kotlin 작성의 여러 측면에 영향을 미치며, Kotlin 코드 가독성 향상을 목표로 하는 일련의 포맷 권장 사항이 그중 하나입니다.

아쉽게도 IntelliJ IDEA에 내장된 코드 포맷터는 이 문서가 릴리스되기 훨씬 이전부터 작동해야 했으며 현재 권장되는 포맷과 다른 기본 설정을 가지고 있습니다.

IntelliJ IDEA의 기본값을 전환하여 이러한 모호성을 제거하고 포맷을 Kotlin 코딩 컨벤션과 일관되게 만드는 것이 논리적인 다음 단계로 보일 수 있습니다. 그러나 이는 Kotlin 플러그인이 설치되는 순간 기존의 모든 Kotlin 프로젝트에 새로운 코드 스타일이 활성화됨을 의미합니다. 플러그인 업데이트에 대한 예상되는 결과는 아니죠?

그렇기 때문에 다음과 같은 마이그레이션 계획을 가지고 있습니다.

* Kotlin 1.3부터 기본적으로 공식 코드 스타일 포맷을 활성화하고 새로운 프로젝트에만 적용합니다(이전 포맷은 수동으로 활성화 가능).
* 기존 프로젝트의 작성자는 Kotlin 코딩 컨벤션으로 마이그레이션하도록 선택할 수 있습니다.
* 기존 프로젝트의 작성자는 프로젝트에서 이전 코드 스타일을 사용한다고 명시적으로 선언하도록 선택할 수 있습니다(이러한 방식으로 프로젝트는 향후 기본값 전환의 영향을 받지 않음).
* Kotlin 1.4에서 기본 포맷으로 전환하고 Kotlin 코딩 컨벤션과 일관되게 만듭니다.

## "Kotlin 코딩 컨벤션"과 "IntelliJ IDEA 기본 코드 스타일" 간의 차이점

가장 눈에 띄는 변화는 연속 들여쓰기 정책에 있습니다. 여러 줄 표현식이 이전 줄에서 끝나지 않았음을 보여주기 위해 이중 들여쓰기를 사용하는 것이 좋은 아이디어입니다. 이것은 매우 간단하고 일반적인 규칙이지만, 여러 Kotlin 구조는 이러한 방식으로 포맷될 때 약간 어색해 보입니다. Kotlin 코딩 컨벤션에서는 긴 연속 들여쓰기가 강제되기 전에 단일 들여쓰기를 사용하는 것이 좋습니다.

<img src="/img/code-formatting-diff.png" alt="Code formatting" width="700"/>

실제로 꽤 많은 코드에 영향을 미치므로 이는 주요 코드 스타일 업데이트로 간주될 수 있습니다.

## 새로운 코드 스타일 논의로의 마이그레이션

새로운 코드 스타일 채택은 이전 방식으로 포맷된 코드가 없을 때 새로운 프로젝트로 시작하는 경우 매우 자연스러운 프로세스일 수 있습니다. 그렇기 때문에 1.3 버전부터 Kotlin IntelliJ Plugin은 기본적으로 활성화된 [Coding conventions](coding-conventions) 문서의 포맷으로 새로운 프로젝트를 생성합니다.

기존 프로젝트에서 포맷을 변경하는 것은 훨씬 더 까다로운 작업이며 팀과 모든 주의 사항을 논의하는 것으로 시작해야 합니다.

기존 프로젝트에서 코드 스타일을 변경하는 주요 단점은 blame/annotate VCS 기능이 관련 없는 커밋을 더 자주 가리키게 된다는 것입니다. 각 VCS에는 이 문제를 처리하는 방법이 있지만 (IntelliJ IDEA에서 ["Annotate Previous Revision"](https://www.jetbrains.com/help/idea/investigate-changes.html)을 사용할 수 있음), 새로운 스타일이 모든 노력을 기울일 가치가 있는지 결정하는 것이 중요합니다. 의미 있는 변경 사항과 분리된 포맷 변경 커밋을 수행하는 것은 나중에 조사하는 데 많은 도움이 될 수 있습니다.

또한 많은 파일을 여러 하위 시스템에서 커밋하면 개인 브랜치에서 병합 충돌이 발생할 수 있으므로 대규모 팀의 경우 마이그레이션이 더 어려울 수 있습니다. 각 충돌 해결은 일반적으로 사소하지만 현재 작업 중인 큰 기능 브랜치가 있는지 아는 것이 현명합니다.

일반적으로 소규모 프로젝트의 경우 모든 파일을 한 번에 변환하는 것이 좋습니다.

중규모 및 대규모 프로젝트의 경우 결정이 어려울 수 있습니다. 많은 파일을 즉시 업데이트할 준비가 되지 않은 경우 모듈별로 마이그레이션하거나 수정된 파일에 대해서만 점진적인 마이그레이션을 계속하기로 결정할 수 있습니다.

## 새로운 코드 스타일로 마이그레이션

Kotlin 코딩 컨벤션 코드 스타일로 전환하는 것은 **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 대화 상자에서 수행할 수 있습니다. 스키마를 **Project**로 전환하고 **Set from...** | **Kotlin style guide**를 활성화합니다.

모든 프로젝트 개발자를 위해 이러한 변경 사항을 공유하려면 `.idea/codeStyle` 폴더를 VCS에 커밋해야 합니다.

프로젝트를 구성하는 데 외부 빌드 시스템이 사용되고 `.idea/codeStyle` 폴더를 공유하지 않기로 결정한 경우 추가 속성으로 Kotlin 코딩 컨벤션을 강제할 수 있습니다.

### Gradle에서

프로젝트 루트의 `gradle.properties` 파일에 `kotlin.code.style=official` 속성을 추가하고 파일을 VCS에 커밋합니다.

### Maven에서

루트 `pom.xml` 프로젝트 파일에 `kotlin.code.style official` 속성을 추가합니다.

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

:::caution
**kotlin.code.style** 옵션이 설정되면 프로젝트 가져오기 중에 코드 스타일 스키마가 수정되고 코드 스타일 설정이 변경될 수 있습니다.

:::

코드 스타일 설정을 업데이트한 후 원하는 범위에서 프로젝트 뷰에서 **Reformat Code**를 활성화합니다.

<img src="/img/reformat-code.png" alt="Reformat code" width="500"/>

점진적인 마이그레이션의 경우 **File is not formatted according to project settings** 검사를 활성화할 수 있습니다. 그러면 포맷해야 하는 위치가 강조 표시됩니다. **Apply only to modified files** 옵션을 활성화하면 검사에서 수정된 파일에서만 포맷 문제를 표시합니다. 이러한 파일은 곧 커밋될 가능성이 높습니다.

## 프로젝트에 이전 코드 스타일 저장

IntelliJ IDEA 코드 스타일을 프로젝트의 올바른 코드 스타일로 명시적으로 설정할 수 있습니다.

1. **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin**에서 **Project** 스키마로 전환합니다.
2. **Load/Save** 탭을 열고 **Use defaults from**에서 **Kotlin obsolete IntelliJ IDEA codestyle**을 선택합니다.

프로젝트 개발자 간에 변경 사항을 공유하려면 `.idea/codeStyle` 폴더를 VCS에 커밋해야 합니다. 또는 Gradle 또는 Maven으로 구성된 프로젝트에 **kotlin.code.style**=**obsolete**를 사용할 수 있습니다.