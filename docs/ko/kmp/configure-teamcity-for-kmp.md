# Kotlin Multiplatform 애플리케이션을 위한 TeamCity 설정하기

<web-summary>Kotlin Multiplatform(KMP)을 위해 TeamCity Cloud 또는 온프레미스(On-Premises) 프로젝트를 설정하는 방법을 알아봅니다. 
이 튜토리얼에서는 즉석 YAML 구성 편집과 직관적인 시각적 에디터를 지원하는 TeamCity 파이프라인을 사용합니다.</web-summary>

이 문서는 KMP 애플리케이션을 빌드, 테스트 및 배포하기 위해 [TeamCity](https://www.jetbrains.com/teamcity/?source=google&medium=cpc&campaign=EMEA_en_DE_TeamCity_Branded&term=jetbrains%20teamcity&content=771411250243&gad_source=1&gad_campaignid=12704027475&gbraid=0AAAAADloJzi5LQxd_2GSPDer8jKk00xHY&gclid=CjwKCAjwyMnNBhBNEiwA-Kcgu9u9Gprgz8eDZs4p-aG14ZSEn3A3JARU_VXxZaEFPMrxGydCbvNJdxoCmToQAvD_BwE)를 설정하는 방법을 설명합니다. 
TeamCity는 모든 주요 VCS 제공업체(GitHub, GitLab, Bitbucket, Azure DevOps, Perforce 등)를 지원하며, 
로컬 및 클라우드 에이전트를 모두 사용하는 확장성 높은 하이브리드 워크플로를 지원합니다. 또한 고가용성을 위한 멀티 노드 설정, 고급 사용자 관리, 이슈 트래커 통합 및 AI 어시스턴트와 같은 강력한 기능을 포함하고 있습니다.

[여기](https://www.jetbrains.com/teamcity/download/)에서 TeamCity 무료 체험판을 시작해 보세요. 
주요 빌드 도구와 SDK가 사전 설정된 JetBrains 호스팅 에이전트가 포함된 클라우드(Cloud) 버전을 선택하거나, 최대한의 제어 권한과 평생 무료 Professional 라이선스가 제공되는 TeamCity 온프레미스(On-Premises) 버전을 선택할 수 있습니다.

이 튜토리얼은 [JetCaster KMP 샘플](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/)을 기반으로 합니다.

## 새 프로젝트 생성

모든 TeamCity 워크플로는 프로젝트(Project)에서 시작됩니다. 프로젝트는 실제 CI/CD 루틴을 실행하는 빌드 구성(Build configuration) 및 파이프라인(Pipeline), 클라우드 에이전트를 구동하는 데 사용되는 클라우드 프로필, 하위 객체와 공유되는 파라미터 등의 엔티티를 소유합니다.

> 자세한 내용은 다음 TeamCity 문서를 참조하세요:
> * [Project administrator guide](https://www.jetbrains.com/help/teamcity/project-administrator-guide.html#Steps%2C+Configurations+and+Projects)
> * [Create and edit projects](https://www.jetbrains.com/help/teamcity/creating-and-editing-projects.html#Create+New+Projects+in+Kotlin+DSL)
>
{style="tip"}

1. 사이드 네비게이션 바의 플러스(+) 버튼을 클릭하여 새 프로젝트를 시작합니다.
2. 프로젝트 이름을 지정하고 선택적으로 설명을 작성합니다.
3. **Create**를 클릭하면 TeamCity에서 실제 빌드 작업을 수행할 객체의 유형(빌드 구성 또는 파이프라인)을 선택하라는 메시지가 표시됩니다.

   <img src="teamcity-kmp-projectselector.png" width="500" alt="Choose configurations or pipelines"/>

   <deflist type="medium">
   <def title="Build configuration">
   TeamCity의 모든 기능을 지원하며, 구성 설정을 Kotlin DSL 코드로 저장할 수 있고 타의 추종을 불허하는 커스터마이징을 제공합니다. 하지만 더 많은 경험과 수동 설정이 필요할 수 있습니다.

   더 알아보기: [Create and edit build configurations](https://www.jetbrains.com/help/teamcity/creating-and-editing-build-configurations.html).
   </def>
   <def title="Pipeline">
   시각적 에디터, 편집 가능한 YAML 구성 및 쉽게 접근할 수 있는 설정을 통해 직관적인 디자인을 제공합니다. 파이프라인은 경험이 적은 사용자와 더 단순한 워크플로를 위해 설계되었습니다.
   TeamCity 2025.11에서 도입된 파이프라인은 현재 빌드 구성에서 사용 가능한 일부 기능이 누락되어 있을 수 있습니다.

   더 알아보기: [Create and edit pipelines](https://www.jetbrains.com/help/teamcity/create-and-edit-pipelines.html).
   </def>
   </deflist>

   이 튜토리얼에서는 설정이 더 쉽고 샘플 프로젝트를 빌드하고 테스트하는 데 필요한 모든 기능을 지원하는 파이프라인(pipelines)을 선택합니다.

4. **Connect new repository**를 선택하고, 나중에 다른 프로젝트에서도 재사용할 수 있도록 GitHub에 영구적으로 연결하려면 **GitHub**를 선택하거나, 특정 리포지토리(샘플 JetCaster 애플리케이션 또는 개인 포크)에만 한정적으로 연결하려면 **Any Git URL**을 선택합니다.

5. TeamCity가 리포지토리에 접근할 수 있음을 확인하면 브랜치 정보를 가져오고 기본 파이프라인 동작을 지정하라는 메시지를 표시합니다.

   <img src="teamcity-kmp-pipelinesettings.png" width="450" alt="Basic pipeline settings"/>

   파이프라인이 리포지토리의 모든 브랜치를 추적하고, `main`을 기본 브랜치로 사용하며, 리포지토리에 변경 사항이 커밋될 때마다 자동으로 새로운 실행을 트리거하도록 기본 설정을 그대로 둡니다.

## 파이프라인 잡 추가

파이프라인이 준비되면 TeamCity가 해당 설정 페이지로 이동합니다. 왼쪽 상단 모서리에 있는 토글을 사용하여 시각적 에디터와 코드 에디터 사이를 전환할 수 있습니다.

<img src="teamcity-kmp-clientarea.png" width="450" alt="Main client area"/>

TeamCity 파이프라인은 잡(Job)으로 구성되며, 잡은 연속적으로 실행되는 빌드 스텝(Build step)의 컬렉션입니다. 빌드 스텝은 특정 작업 집합을 캡슐화하는 TeamCity 루틴의 가장 작은 단위입니다.

TeamCity UI에서 잡 타일을 클릭하여 설정을 편집하거나, 잡 아래의 어두운 영역을 클릭하여 전역 파이프라인 설정을 수정할 수 있습니다.

### 공통 파이프라인 설정

이 튜토리얼에서는 전역 파이프라인 옵션을 설정할 필요가 없습니다. 다음과 같이 파이프라인 내의 모든 잡에 영향을 미치는 설정에 대한 자세한 정보는 [이 문서](https://www.jetbrains.com/help/teamcity/pipeline-settings.html)를 참조하세요.

* **Auto-run pipelines** — 원격 리포지토리에 새 변경 사항이 커밋될 때(기본적으로 활성화됨), 리포지토리에 풀 리퀘스트가 열릴 때 또는 설정된 일정에 따라 파이프라인이 자동으로 실행되도록 구성할 수 있습니다.
* **Repository** — 서로 다른 VCS 호스팅 제공업체의 여러 리포지토리를 체크아웃하고 처리할 수 있습니다.
* **Integrations** — 외부 NPM 및 Docker 레지스트리를 연결할 수 있습니다. 공개 Docker Hub 이미지 내부에서 빌드 스텝을 실행하려는 경우, 파이프라인이 익명 풀(pull)에 대한 Docker Hub의 속도 제한을 초과할 정도로 자주 실행되지 않는 한 해당 통합을 구성할 필요는 없습니다.

### 에이전트 설정

빌드 작업은 베어메탈 또는 클라우드 머신에 설치된 빌드 에이전트(Build agents)에 의해 처리됩니다. 이 머신들에는 해당 빌드 작업에 필요한 모든 도구가 설치되어 있어야 합니다. 예를 들어, 이 파이프라인의 Job 2에는 Android SDK가 필요하며, Job 3은 Xcode를 사용하여 iOS 버전의 앱을 빌드합니다.

* TeamCity Cloud는 [광범위한 빌드 도구가 설치된](https://www.jetbrains.com/help/teamcity/cloud/jetbrains-hosted-agents.html#Agent+Software) JetBrains 호스팅 에이전트를 사용합니다. 이 튜토리얼에서는 추가 에이전트를 연결할 필요가 없습니다.
* TeamCity 온프레미스를 사용하는 경우 모든 잡이 최소 하나 이상의 에이전트에서 실행될 수 있는지 확인해야 합니다. 자세한 내용은 이 문서를 참조하세요: [Install and start TeamCity agents](https://www.jetbrains.com/help/teamcity/install-and-start-teamcity-agents.html).

이 튜토리얼에서 잡은 필요한 도구가 설치된 에이전트에만 할당되도록 에이전트 요구 사항(Agent requirements)을 지정합니다.

### 공유 테스트 실행

YAML 파이프라인 에디터로 전환하고 다음 마크업을 붙여넣어 첫 번째 잡을 설정합니다.

```yaml
jobs:
  Job1:
    name: Run tests
    steps:
      - type: gradle
        use-gradle-wrapper: true
        name: Gradle test
        jdk-home: '%\env.JDK_17_0%'
        tasks: jvmTest
    files-publication:
      - path: '**/build/reports/tests/**/*'
        share-with-jobs: false
        publish-artifact: true
    allow-reuse: false
```

이 잡은 Java 17을 사용하여 `jvmTest` Gradle 태스크를 실행합니다. `.../build/reports/tests/...`와 경로가 일치하는 모든 파일을 수집하여 `test-reports` 폴더 아래에 그룹화하고, 이 폴더를 아티팩트(Artifact)로 게시합니다.

**Optimizations | Parallel tests** 잡 옵션을 활성화하여 테스트 모음을 더 작은 배치로 분할하고 각 배치를 별도의 빌드 에이전트에서 처리할 수도 있습니다. 
이렇게 하면 전체 실행 시간을 크게 줄일 수 있지만 더 많은 리소스를 사용하게 됩니다. 
병렬 테스트를 활성화하려면 아래와 같이 `parallelism` 설정을 포함하도록 파이프라인 YAML을 수정하세요.

```yaml
    ...
    allow-reuse: false
    parallelism: 3
```

**Allow reuse** 최적화 옵션은 파이프라인 구성이나 소스 코드에 변경 사항이 없는 경우 TeamCity가 태스크 재실행을 건너뛸지 여부를 지정합니다.

추가 정보는 [Job settings](https://www.jetbrains.com/help/teamcity/job-settings.html) 및 [Gradle build step](https://www.jetbrains.com/help/teamcity/gradle.html)을 참조하세요.

### Android 디버그 패키지 빌드

파이프라인 YAML을 다음과 같이 수정합니다.

```yaml
jobs:
  Job1:
    name: Run tests
    ...
    Job2:
      name: Build Android
      steps:
        - type: gradle
          jdk-home: '%\env.JDK_17_0%'
          tasks: ':mobile:assembleDebug'
          use-gradle-wrapper: true
      files-publication:
        - path: mobile/build/outputs/apk/debug/*.apk
          share-with-jobs: false
          publish-artifact: true
      runs-on:
        self-hosted:
          - requirement: exists
            name: Android home
            parameter: env.ANDROID_HOME
      dependencies:
        - Job1
```

* `requirement` 블록은 이 잡이 Android SDK가 설치된 에이전트에만 할당되도록 보장합니다. 
* `dependencies` 섹션은 이 잡이 `Job1`이 성공적으로 완료된 후에만 시작되도록 보장합니다.

### iOS 시뮬레이터 애플리케이션 빌드

마지막 단계로, 파이프라인 YAML에 다음 마크업을 추가합니다.

```yaml
jobs:
  Job1:
    ...
  Job2:
    ...
  Job3:
    name: Build iOS
    steps:
      - type: script
        script-content: |-
          xcodebuild build \
            -project JetcasterMigration/JetcasterMigration.xcodeproj \
            -configuration Debug \
            -scheme JetcasterMigration \
            -sdk iphonesimulator \
            -derivedDataPath ./build \
            -verbose
    files-publication:
      - path: build/Build/Products/Debug-iphonesimulator/**/*
        share-with-jobs: false
        publish-artifact: true
    dependencies:
      - Job1
```

처음 두 잡과 달리 **Build iOS**는 범용 [커맨드 라인 빌드 스텝(Command-line build step)](https://www.jetbrains.com/help/teamcity/command-line.html)을 사용합니다. 이 스텝을 통해 명령어를 실행하거나 에이전트 머신에 설치된 모든 도구와 상호 작용할 수 있습니다.

`dependencies` 섹션은 `Job1`에 대한 의존성을 지정합니다. 즉, **Build Android** 및 **Build iOS** 잡은 병렬로 실행될 수 있지만 `Job1`의 테스트 루틴이 완료된 후에만 시작됩니다.

> 빌드 구성을 작업할 때는 스크립트(Script) 빌드 스텝을 특화된 [Xcode Project 스텝](https://www.jetbrains.com/help/teamcity/xcode-project.html)으로 교체할 수 있습니다.
>
{style="tip"}

## 파이프라인 실행

오른쪽 상단 모서리에 있는 **Save and Run**을 클릭하여 워크플로를 시작합니다. 
잡이 완료되면 게시된 모든 아티팩트를 빌드 로그 옆의 **Artifacts** 탭에서 확인할 수 있습니다.

<img src="teamcity-kmp-artifacts.png" alt="TeamCity artifacts" width="450"/>

`Job1`에는 **Tests** 탭도 표시되어 테스트 결과를 검사할 수 있습니다.

<img src="teamcity-kmp-tests.png" alt="TeamCity tests" width="450"/>

## 다음 단계

이 샘플을 계속 수정하여 더 많은 이점을 얻을 수 있습니다.

* **VCS 연결을 사용하여 파이프라인 추가**
 
  [프로젝트에 새 파이프라인을 추가](#create-a-new-project)할 때 **Any Git URL** 대신 **GitHub**를 선택하세요. 
  이 방식은 향후 GitHub 기반 프로젝트에 대해 VCS 접근 설정을 건너뛸 수 있게 해줄 뿐만 아니라 추가적인 파이프라인 기능을 잠금 해제합니다.

    * TeamCity는 실행 상태(성공, 실패 또는 실행 중)를 GitHub에 직접 [게시(Post run statuses)](https://www.jetbrains.com/help/teamcity/create-and-edit-pipelines.html#Publish+Run+Statuses+to+VCS)할 수 있습니다.
    * [**On new changes** 트리거](https://www.jetbrains.com/help/teamcity/pipeline-settings.html#On+New+Changes) 및 [**Repository** 항목](https://www.jetbrains.com/help/teamcity/pipeline-settings.html#Repository)에 **Pull requests** 토글이 포함되어, 아직 안정 브랜치에 커밋되지 않은 변경 사항을 추적하고 빌드할 수 있습니다.

* **고급 빌드 구성 탐색**

  고급 기능을 사용하려면 파이프라인에서 [빌드 구성(Build configurations)](https://www.jetbrains.com/help/teamcity/configuring-general-settings.html)으로 전환하세요.

    * [빌드 체인(Build chains)](https://www.jetbrains.com/help/teamcity/build-chain.html) 및 [복합 구성(Composite configurations)](https://www.jetbrains.com/help/teamcity/composite-build-configuration.html)을 사용하여 워크플로의 특정 부분을 실행합니다. 예를 들어, **Build Android**를 트리거하지 않고 **Test → Build iOS**만 실행하거나 테스트 구성만 단독으로 실행할 수 있습니다.
    * JetBrains에서 제작한 전체 빌드 스텝 라이브러리, 커뮤니티 레시피 및 [GitHub releases](https://blog.jetbrains.com/teamcity/2025/09/teamcity-github-releases-plugin/)와 같은 비번들 스텝을 활용하세요.
    * [에이전트를 Kubernetes 클러스터에 배포](https://www.jetbrains.com/help/teamcity/setting-up-teamcity-for-kubernetes.html)하거나 [외부 실행기(External executor)](https://www.jetbrains.com/help/teamcity/kubernetes-executor.html)로 사용하세요.
    * [이슈 트래커](https://www.jetbrains.com/help/teamcity/integrating-teamcity-with-issue-tracker.html) 및 [비밀 저장소(Secret vaults)](https://www.jetbrains.com/help/teamcity/hashicorp-vault.html)와의 통합을 설정하세요.