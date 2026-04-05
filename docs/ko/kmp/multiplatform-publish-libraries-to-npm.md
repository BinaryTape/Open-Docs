[//]: # (title: 라이브러리를 npm에 배포하기 – 튜토리얼)

<tldr>
<p><a href="https://npm-publish.petuska.dev/latest/">npm-publish Gradle 플러그인</a>을 사용하여 Kotlin Multiplatform 라이브러리를 npm에 수동으로 또는 GitHub Actions를 통해 배포하세요.</p>
</tldr>

라이브러리를 배포하려면 다음 단계가 필요합니다:

1. [npm 계정](https://docs.npmjs.com/creating-a-new-npm-user-account) 및 [액세스 토큰](https://docs.npmjs.com/creating-and-viewing-access-tokens)을 포함한 자격 증명을 준비합니다.
2. Kotlin Multiplatform 프로젝트에서 배포 플러그인을 설정합니다.
3. 배포 플러그인에 자격 증명을 제공하거나 지속적 통합(CI)을 위해 신뢰할 수 있는 배포자(Trusted Publisher)를 설정합니다.
4. 수동으로 또는 CI를 사용하여 배포 태스크를 실행합니다.

이 튜토리얼에서는 프로젝트를 호스팅하고 GitHub Actions를 통해 CI를 실행하기 위해 GitHub를 사용합니다.

## 샘플 라이브러리

[샘플 라이브러리 프로젝트](https://github.com/Kotlin/kotlin-multiplatform-web-library)를 활용해 
내용을 따라 하며 작동하는 설정을 확인할 수 있습니다.

코드를 재사용하는 경우, **모든 예시 값**을 프로젝트에 해당하는 값으로 교체해야 합니다.

## 계정 및 자격 증명 준비

npm에 배포하려면 [npm 포털에 로그인](https://www.npmjs.com/login)되어 있어야 합니다.

이 튜토리얼에서는 수동 배포를 설정하기 위해 조직(organization)과 액세스 토큰이 필요합니다.

### 간단한 조직 생성

이 튜토리얼에서는 이름 충돌을 방지하기 위해 npm 조직 아래에 라이브러리를 배포합니다.

새 조직을 만들려면 [npm 문서](https://docs.npmjs.com/creating-an-organization)를 따르세요.

### 액세스 토큰 생성

npm에 수동으로 배포하려면 새로 생성한 조직 아래에 패키지를 배포할 수 있는 액세스 토큰이 필요합니다.
토큰을 생성하려면 [npm 가이드](https://docs.npmjs.com/creating-and-viewing-access-tokens)를 따르세요.

이 튜토리얼에서는 간소화된 보안 설정을 사용합니다:
* **Bypass two-factor authentication (2FA)** 옵션을 활성화합니다.
* 토큰의 일반 권한(general permissions)과 조직 권한(organization permissions)을 모두 **Read and write**로 설정합니다.

## 라이브러리 프로젝트 설정

[샘플 프로젝트](https://github.com/Kotlin/kotlin-multiplatform-web-library)를 사용하는 경우,
배포하기 전에 기본 이름들을 업데이트하세요.
여기에는 다음이 포함됩니다:

* 라이브러리 모듈 이름.
* `settings.gradle.kts` 파일에 설정된 프로젝트 이름. 

이름 설정이 완료되면 다음 단계에 따라 배포를 설정하세요.

### 배포 플러그인 설정

이 튜토리얼에서는 npm 배포를 돕기 위해 공식 [npm-publish 플러그인](https://github.com/Kotlin/npm-publish)을 사용합니다.
플러그인 및 사용 가능한 설정 옵션에 대해 자세히 알아보려면 [플러그인 문서](https://npm-publish.petuska.dev)를 참조하세요.

Kotlin Multiplatform 프로젝트에 플러그인을 추가합니다:

1. 라이브러리 모듈의 `build.gradle.kts` 파일을 엽니다.

2. `plugins {}` 블록에 다음 라인을 추가합니다: 

    ```kotlin
    // <모듈 디렉터리>/build.gradle.kts
    
    plugins {
        kotlin("npm-publish") version "%npmPublishPlugin%"
    }
    ```
    
    > 플러그인의 최신 버전을 확인하려면 [Releases](https://github.com/Kotlin/npm-publish/releases) 페이지를 참조하세요.
    > 
    {style="note"}

3. 다음 설정을 추가합니다.
   라이브러리에 맞게 값을 수정해야 합니다.
   필수 파라미터는 `organization`, `authToken`, `packageName`, `version`뿐입니다.
   나머지는 확장된 예시로 제공됩니다:

    ```kotlin
    // <모듈 디렉터리>/build.gradle.kts
    npmPublish {
        organization = "organization_name_without_the_@_sign"
        
        registries {
            npmjs {
                // 패키지를 배포하는 명령을 실행할 때 
                // 이 환경 변수로 npm 토큰을 전달하게 됩니다
                authToken = System.getenv("NPM_TOKEN")
            }
        }
    
        packages {
            named("js") {
                version = "0.0.1"
                packageName = "greetings"
                readme = file("../README.md")
    
                packageJson {
                    license = "Apache 2.0"
                    homepage = "https://github.com/Kotlin/kotlin-multiplatform-web-library#readme"
                    description = "Shared Kotlin/JS Greetings library"
                    keywords = listOf("kotlin", "kotlin-js", "greetings", "shared", "api")
                    author {
                        name = "Kotlin Developer Advocate"
                        url = "https://github.com/kotlin-hands-on/"
                    }
                    contributors = listOf(
                        Person {
                            name = "John Smith"
                            email = "john.smith@example.com"
                            url = "https://github.com/johnsmith"
                        },
                    )
                    repository {
                        type = "git"
                        url = "https://github.com/Kotlin/kotlin-multiplatform-web-library.git"
                    }
                }
            }
        }
    }
    ```

    > 이를 설정하기 위해 [Gradle 속성(properties)](https://docs.gradle.org/current/userguide/build_environment.html)을 사용할 수도 있습니다.
    > 
    {style="tip"}

`npmPublish {}` 블록의 중요한 설정은 다음과 같습니다:

* `organization` 파라미터와 `registries {}` 블록은 인증 상세 정보를 지정합니다.
  이 경우 메인 npm 레지스트리를 사용하며, 배포 태스크 실행 시 토큰을 보유해야 하는 `NPM_TOKEN` 변수 이름을 지정합니다.
* `packageName`과 `version` 파라미터는 필수 패키지 옵션을 정의합니다:
  * `version` 파라미터를 생략하면 모듈의 버전이 기본값으로 사용됩니다.
  * `packageName` 파라미터를 생략하면 모듈의 이름이 기본값으로 사용됩니다.
* `packageJson {}` 블록은 다양한 메타데이터를 담습니다.

## 수동 배포

수동 배포는 프로젝트 구조를 실험 중이거나 배포 자동화를 직접 구현하려는 경우 유용할 수 있습니다.

이제 로컬 머신에서 npm으로 라이브러리를 배포할 수 있습니다.
배포를 위해 다음 명령을 실행하되, `YOUR_ACCESS_TOKEN` 자리에 이전에 생성한 액세스 토큰을 붙여넣으세요:

```bash
NPM_TOKEN=YOUR_ACCESS_TOKEN ./gradlew :shared:publishJsPackageToNpmjsRegistry
```

라이브러리가 배포되면 npm 레지스트리에서 확인할 수 있습니다.
npm 조직 페이지를 열고 **Packages** 탭을 확인하세요(개인 **Packages** 페이지가 아닙니다).

![npm에 배포된 라이브러리](published-on-npm.png){width=700}

### 문제 해결

수동 배포 시 자주 발생할 수 있는 몇 가지 문제입니다:

* `build.gradle.kts` 설정의 `version` 필드를 잘 관리하세요:
  동일하거나 이전 버전으로 이미 배포된 패키지가 있다면 npm 배포가 실패합니다.
* 조직 범위(organization-scoped) 패키지용 토큰을 생성할 때,
  일반 권한 **및** 조직 권한을 모두 설정했는지 확인하세요.

## 지속적 통합(CI)을 사용하여 배포

npm의 신뢰할 수 있는 배포자(Trusted Publishers) 메커니즘을 사용하면 OpenID Connect를 통해 CI를 빠르게 설정할 수 있습니다.
이 방식은 토큰을 생성하고 유지 관리할 필요가 없습니다.

이 예제에서는 [GitHub Actions](https://docs.github.com/en/actions)를 사용하여 워크플로를 설정합니다.

### GitHub Actions 워크플로 파일 생성

GitHub 액션을 구성하는 `.github/workflows/publish.yml` 파일을 생성합니다:

```yaml
# .github/workflows/publish.yml

name: Publish

on:
  release:
    types: [released, prereleased]

permissions:
  id-token: write  # GitHub Actions가 npm 신뢰할 수 있는 배포자와
                   # 통합하는 데 필요합니다
  contents: read

jobs:
  publish:
    name: Release build and publish
    runs-on: ubuntu-latest
    steps:
      # 트리거된 브랜치 체크아웃
      - name: Check out code
        uses: actions/checkout@v4

      # Gradle 태스크 실행을 위한 JDK 설정
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 21

      # 라이브러리 모듈에 대한 배포 Gradle 태스크 실행
      - name: Publish to npm
        run: ./gradlew :shared:publishJsPackageToNpmjsRegistry
```

이 파일을 프로젝트가 호스팅된 GitHub 저장소에 커밋하고 푸시하면,
해당 저장소에서 GitHub 릴리스를 생성할 때마다 워크플로가 실행됩니다.

> 저장소에 [태그가 푸시될 때 트리거](https://stackoverflow.com/a/61892639)되도록 워크플로를 구성할 수도 있습니다.
> 
{style="tip"}

### GitHub Actions를 신뢰할 수 있는 배포자로 설정

워크플로가 공개되었으므로, 이제 GitHub Action을 npm 패키지의 [신뢰할 수 있는 배포자(Trusted Publisher)](https://docs.npmjs.com/trusted-publishers)로 추가할 수 있습니다:

1. [수동으로 배포한 패키지](#publish-manually) 페이지를 엽니다.
2. **Settings** 탭을 열고 **Trusted Publisher** 섹션을 찾습니다.
3. **Select your publisher** 아래에서 **GitHub Actions** 버튼을 클릭합니다.
4. 양식을 작성합니다:
   * GitHub 사용자 이름 (또는 조직)
   * 저장소 이름
   * 워크플로 파일 이름 (이 튜토리얼에서는 [publish.yml](#create-a-github-actions-workflow-file)을 사용했습니다).
5. **Setup connection** 버튼을 클릭합니다.

![GitHub Actions를 위한 npm 신뢰할 수 있는 배포자 설정](npm-trusted-publisher-github.png)

> [npm은 제공된 좌표를 검증하지 않으므로](https://docs.npmjs.com/trusted-publishers#troubleshooting),
> 상세 정보를 정확하게 입력했는지 확인하세요.
> 
{style="warning"}

생성된 연결은 패키지 설정의 **Trusted Publishers** 섹션에 나열되며, 이는 지정된 좌표의 워크플로가 이제 npm에 배포할 권한을 가졌음을 의미합니다.

### GitHub에서 릴리스 생성

워크플로와 신뢰할 수 있는 배포자 연결이 설정되었으므로, 이제 [GitHub 릴리스 생성](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)을 통해 배포를 트리거할 준비가 되었습니다:

1. `build.gradle.kts` 설정의 패키지 버전을 배포하려는 버전으로 설정합니다.

   > 이미 사용 중이거나 이미 배포된 버전보다 낮은 버전 번호로는 npm 배포가 허용되지 않습니다.
   > 
   > {style="note"}

2. GitHub 저장소로 이동합니다.
3. 오른쪽 사이드바에서 **Releases**를 클릭합니다.
4. **Draft a new release** 버튼을 클릭합니다(이 저장소에서 이전에 릴리스를 만든 적이 없다면 **Create a new release** 버튼 클릭).
5. Git 태그를 생성하거나 선택합니다(시스템 간 번호 일관성을 위해 가능하면 모듈의 버전과 일치시키세요).
6. 릴리스 제목을 설정합니다(릴리스 이름을 태그와 동일하게 지정하는 것이 편리합니다).
   
   관리를 원활하게 하기 위해, 태그의 버전이 `build.gradle.kts` 파일에 지정한 라이브러리의 버전 번호와 동일하게 만드는 것이 좋습니다.

   ![GitHub에서 릴리스 생성](create-release-and-tag-for-npm.png){width=700}

7. **Publish release** 버튼을 클릭합니다.

Action이 트리거되었는지 확인하려면 GitHub 저장소 페이지 상단의 **Actions** 탭을 클릭하세요.
새로 게시된 릴리스가 배포 워크플로 실행을 트리거한 것을 볼 수 있습니다.
워크플로를 클릭하여 배포 태스크의 로그를 확인하세요.

워크플로 실행이 완료되면, npm 레지스트리의 패키지 페이지에 새로운 버전의 패키지가 나열됩니다.

![CI/CD를 통해 npm에 배포된 라이브러리](published-second-version-on-npm.png){width=700}

## 다음 단계

* [README에 shield.io 배지 추가](https://shields.io/badges/npm-version)
* [Dokka로 API 문서 생성](https://kotl.in/dokka)
* [Renovate로 종속성 업데이트 자동화](https://docs.renovatebot.com/)
* [Kotlin Slack에서 커뮤니티와 라이브러리 공유](https://kotlinlang.slack.com/)
  (가입하려면 https://kotl.in/slack 방문)