[//]: # (title: Kotlin 코드 스타일로 마이그레이션)

<no-index/>

> Kotlin 1.4.0부터 IntelliJ IDEA의 모든 프로젝트에서 공식 코드 스타일 포맷팅이 기본으로 활성화됩니다.
> 
{style="note"}

## Kotlin 코딩 컨벤션 및 IntelliJ IDEA 포맷터

[Kotlin 코딩 컨벤션(coding conventions)](coding-conventions.md)은 관용적인(idiomatic) Kotlin을 작성하는 여러 측면에 영향을 미치며, Kotlin 코드의 가독성을 높이기 위한 포맷팅 권장 사항도 그중 하나입니다.

IntelliJ IDEA에 내장된 코드 포맷터는 이전까지 현재 권장되는 방식과 다른 포맷팅을 생성하는 기본 설정을 사용해 왔습니다.

저희는 IntelliJ IDEA의 기본 설정을 변경하여 Kotlin 코딩 컨벤션과 일치하도록 포맷팅을 조정함으로써 이러한 불일치를 해결하고자 합니다. 이를 위해 다음과 같은 마이그레이션 계획이 시행되었습니다:

* Kotlin 1.3.0부터 공식 코드 스타일 포맷팅이 기본적으로 활성화되었으며, 이는 신규 프로젝트에만 적용됩니다(이전 포맷팅은 수동으로 활성화할 수 있습니다).
* 기존 프로젝트의 작성자는 Kotlin 코딩 컨벤션으로 마이그레이션하도록 선택할 수 있습니다.
* 기존 프로젝트의 작성자는 프로젝트에서 이전 코드 스타일을 사용하도록 명시적으로 선언할 수 있습니다(이렇게 하면 나중에 기본 설정이 전환되더라도 프로젝트가 영향을 받지 않습니다).
* Kotlin 1.4.0부터는 Kotlin 코딩 컨벤션과의 일관성을 위해 모든 프로젝트에서 기본 포맷팅이 활성화됩니다.

## "Kotlin 코딩 컨벤션"과 "IntelliJ IDEA 기본 코드 스타일"의 차이점

가장 눈에 띄는 변화는 연속 들여쓰기(continuation indentation) 정책입니다. 여러 줄로 이어진 표현식이 이전 줄에서 끝나지 않았음을 보여주기 위해 이중 들여쓰기를 사용하는 것은 좋은 아이디어입니다. 이는 단순하고 일반적인 규칙이지만, 몇몇 Kotlin 구문은 이 방식으로 포맷팅할 때 다소 어색해 보일 수 있습니다. Kotlin 코딩 컨벤션에서는 이전에 긴 연속 들여쓰기가 강제되었던 경우에 단일 들여쓰기를 사용할 것을 권장합니다.

<img src="code-formatting-diff.png" alt="코드 포맷팅" width="700"/>

실제로는 꽤 많은 코드에 영향을 미치므로, 이는 주요한 코드 스타일 업데이트로 간주될 수 있습니다.

## 새로운 코드 스타일 도입에 관한 논의

새로운 프로젝트를 시작할 때 이전 방식으로 포맷팅된 코드가 없다면 새로운 코드 스타일을 도입하는 것은 매우 자연스러운 과정일 것입니다. 그렇기에 Kotlin IntelliJ 플러그인 1.3.0 버전부터는 기본적으로 활성화되는 [코딩 컨벤션(Coding conventions)](coding-conventions.md) 문서의 포맷팅을 적용하여 새 프로젝트를 생성합니다.

기존 프로젝트에서 포맷팅을 변경하는 것은 훨씬 더 까다로운 작업이며, 팀원들과 함께 모든 주의 사항을 논의한 후 시작하는 것이 좋습니다.

기존 프로젝트에서 코드 스타일을 변경할 때의 주요 단점은 VCS의 blame/annotate 기능이 관련 없는 커밋을 가리키는 경우가 더 자주 발생한다는 점입니다. 각 VCS에는 이 문제를 해결하기 위한 방법이 있지만(IntelliJ IDEA에서는 ["Annotate Previous Revision"](https://www.jetbrains.com/help/idea/investigate-changes.html)을 사용할 수 있음), 새로운 스타일이 이러한 노력을 들일 가치가 있는지 결정하는 것이 중요합니다. 재포맷팅 커밋을 의미 있는 변경 사항과 분리하여 커밋하는 관행은 나중에 조사할 때 큰 도움이 될 수 있습니다.

또한, 여러 서브시스템의 수많은 파일을 커밋하면 개인 브랜치에서 머지 충돌(merging conflicts)이 발생할 수 있으므로 규모가 큰 팀일수록 마이그레이션이 더 어려울 수 있습니다. 각 충돌 해결은 대개 간단하지만, 현재 작업 중인 대규모 피처 브랜치가 있는지 확인하는 것이 현명합니다.

일반적으로 소규모 프로젝트의 경우 모든 파일을 한 번에 변환하는 것을 권장합니다.

중대형 프로젝트의 경우 결정이 쉽지 않을 수 있습니다. 당장 많은 파일을 업데이트할 준비가 되지 않았다면, 모듈별로 마이그레이션하거나 수정된 파일에 대해서만 점진적으로 마이그레이션을 진행할 수도 있습니다.

## 새로운 코드 스타일로 마이그레이션

**Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 대화 상자에서 Kotlin 코딩 컨벤션 코드 스타일로 전환할 수 있습니다. 스킴(scheme)을 **Project**로 전환하고 **Set from...** | **Kotlin style guide**를 활성화하세요.

이러한 변경 사항을 프로젝트의 모든 개발자와 공유하려면 `.idea/codeStyle` 폴더를 VCS에 커밋해야 합니다.

프로젝트 구성을 위해 외부 빌드 시스템을 사용하고 있고 `.idea/codeStyle` 폴더를 공유하지 않기로 결정했다면, 추가 속성을 통해 Kotlin 코딩 컨벤션을 강제할 수 있습니다:

### Gradle의 경우

프로젝트 루트의 `gradle.properties` 파일에 `kotlin.code.style=official` 속성을 추가하고 해당 파일을 VCS에 커밋하세요.

### Maven의 경우

프로젝트 루트의 `pom.xml` 파일에 `kotlin.code.style official` 속성을 추가하세요.

```xml
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

>**kotlin.code.style** 옵션이 설정되어 있으면 프로젝트를 임포트하는 동안 코드 스타일 스킴이 수정되거나 코드 스타일 설정이 변경될 수 있습니다.
>
{style="warning"}

코드 스타일 설정을 업데이트한 후, 프로젝트 뷰에서 원하는 범위를 선택하고 **Reformat Code**를 실행하세요.

<img src="reformat-code.png" alt="코드 재포맷팅" width="500"/>

점진적인 마이그레이션을 위해 **File is not formatted according to project settings** 인스펙션(inspection)을 활성화할 수도 있습니다. 이 기능은 재포맷팅이 필요한 부분을 강조 표시해 줍니다. **Apply only to modified files** 옵션을 활성화하면 수정된 파일의 포맷팅 문제만 표시됩니다. 어차피 이러한 파일들은 조만간 커밋될 가능성이 높습니다.

## 프로젝트에 이전 코드 스타일 유지하기

언제든지 IntelliJ IDEA의 이전 코드 스타일을 프로젝트의 올바른 코드 스타일로 명시적으로 설정할 수 있습니다:

1. **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin**에서 **Project** 스킴으로 전환합니다.
2. **Load/Save** 탭을 열고 **Use defaults from**에서 **Kotlin obsolete IntelliJ IDEA codestyle**를 선택합니다.

프로젝트 개발자들 간에 변경 사항을 공유하려면 `.idea/codeStyle` 폴더를 VCS에 커밋해야 합니다. 또는 Gradle이나 Maven으로 구성된 프로젝트의 경우 **kotlin.code.style**=**obsolete**를 사용할 수도 있습니다.