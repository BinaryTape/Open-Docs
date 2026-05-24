[//]: # (title: Junie를 사용하여 Kotlin Multiplatform 프로젝트의 CocoaPods 의존성을 SwiftPM으로 전환하기)
<primary-label ref="Experimental"/>

CocoaPods 의존성이 있는 KMP 모듈이 있고 [SwiftPM 가져오기(import)](multiplatform-spm-import.md)를 사용하여 Swift 패키지로 전환하고 싶다면, AI의 도움을 받을 수 있습니다.
이 가이드는 Junie와 Kotlin AI 스킬(skills)을 사용하여 이 과정을 더 쉽게 진행하는 방법을 보여줍니다.

> 이 가이드에서는 Junie를 사용하지만, [Kotlin AI 스킬](https://kotlinlang.org/docs/kotlin-ai-skills.html)을 지원하는 모든 AI 도구를 사용하여
> 이 과정을 완료할 수 있습니다.
> 
{style="tip"}

모든 AI 도구와 마찬가지로 Junie도 실수를 할 수 있습니다.
수동으로 마이그레이션하는 것을 선호한다면, [Kotlin Multiplatform 프로젝트의 CocoaPods 의존성을 SwiftPM으로 전환하기](multiplatform-cocoapods-spm-migration.md)를 참조하세요.

## Junie CLI 설정

터미널에서 Junie CLI를 설치합니다.

```bash
curl -fsSL https://junie.jetbrains.com/install.sh | bash
```

Junie CLI를 처음 실행하여 JetBrains 계정으로 로그인하거나
외부 LLM을 사용하도록 설정합니다.

```bash
junie
```

![Junie CLI 로그인 프롬프트](cocoapods-spm-junie-login.png){width="500"}

[인증 옵션](https://junie.jetbrains.com/docs/junie-cli.html#step-3-authenticate)에 대한 자세한 내용은 Junie 문서를 참조하세요.

## AI 스킬 설치

터미널에서 프로젝트 디렉터리로 이동하여 해당 Kotlin AI 스킬을 설치합니다.
<!-- 정식 버전의 Junie CLI는 곧 확장을 지원할 예정입니다 https://junie.jetbrains.com/docs/junie-cli-extensions.html -->

```shell
npx skills add Kotlin/kotlin-agent-skills
```

> 이 명령이 작동하려면 5.2.0 이상의 npm 버전이 필요합니다.
> 
{style="note"}

대화 상자에서 `kotlin-tooling-cocoapods-spm-migration` 스킬을 선택하고, 이를 설치할 에이전트로 Junie를 선택합니다.
범위(scope)를 묻는 메시지가 나타나면 스킬의 범위를 현재 프로젝트로 제한하기 위해 `Project`를 선택합니다.

## 마이그레이션 시작

시작하기 전에 프로젝트가 Git과 같은 VCS(버전 관리 시스템)를 사용하고 있는지 확인하세요.
이는 초기 상태 및 각 반복 작업 후의 변경 사항을 검토하는 데 중요합니다.

1. 터미널을 열고 프로젝트 디렉터리로 이동합니다.
2. 다음 명령을 입력하여 Junie를 대화형 모드로 시작합니다.

    ```shell
    junie
    ```

3. 다음 프롬프트를 입력합니다.

    ```text
    Migrate <project-name> from CocoaPods to SwiftPM
    ```
   
Junie는 설치한 스킬이 해당 작업에 적합함을 인식하고 마이그레이션 프로세스를 시작합니다.

## 변경 사항 검토 및 테스트

프로젝트 Git 히스토리에서 Junie가 수행한 모든 변경 사항을 검토하세요.
Git 클라이언트의 side-by-side diff 뷰어를 사용하면 변경 사항을 쉽게 검토할 수 있습니다.
예를 들어 IntelliJ IDEA에서는 다음과 같습니다.

![CocoaPods 의존 코드가 변경된 내용의 side-by-side diff](cocoapods-spm-junie-diff.png)

성공적인 마이그레이션은 다음을 수정합니다:
* CocoaPods에 의존하는 모듈의 `build.gradle.kts` 파일: `cocoapods {}` 블록이 `swiftPMDependencies {}` 블록으로 교체됩니다.
* CocoaPods API를 참조하는 가져오기 지시문(import directives)이 포함된 Kotlin 파일: 이를 SwiftPM API 가져오기로 교체합니다.

프로젝트가 이전과 같이 실행되는지 테스트하세요.
문제가 발생하면 로그의 에러 메시지를 확인하고 Junie에게 해결을 요청하세요.
스스로 문제를 해결할 수 없는 경우 [Slack](https://kotlinlang.slack.com/archives/C8CFFCVAB)에 문의하여 도움을 받으세요.

> 할당량(quota) 소비량을 확인하려면 Junie의 대화형 모드에서 `/usage` 명령을 실행하세요.
> 
{style="tip"}

## 다음 단계

* `main` 브랜치에서는 CocoaPods를 사용하고 `spm-import` 브랜치에서는 SwiftPM을 사용하는 다음 샘플 프로젝트들을 확인해 보세요.
    * [Firebase 샘플](https://github.com/Kotlin/kmp-with-cocoapods-firebase-sample/)
    * [Compose Multiplatform 샘플](https://github.com/Kotlin/kmp-with-cocoapods-compose-sample/)
* 다음 내용에 대해 자세히 알아보세요.
    * [Swift 패키지 내보내기(export) 설정](multiplatform-spm-export.md)
    * [KMP 모듈에 Swift 패키지를 의존성으로 추가하기](multiplatform-spm-import.md)
* 다른 [Kotlin AI 스킬](https://kotlinlang.org/docs/kotlin-ai-skills.html)도 살펴보세요.