[//]: # (title: 라이브러리를 Maven Central에 게시하기 – 튜토리얼)

이 튜토리얼에서는 Kotlin Multiplatform 라이브러리를 [Maven Central](https://central.sonatype.com/) 저장소에 게시하는 방법을 배웁니다.

라이브러리를 게시하려면 다음을 수행해야 합니다:

1.  Maven Central 계정 및 서명을 위한 PGP 키를 포함한 자격 증명 설정.
2.  라이브러리 프로젝트에서 게시 플러그인 구성.
3.  아티팩트에 서명하고 업로드할 수 있도록 게시 플러그인에 자격 증명 제공.
4.  로컬 또는 지속적 통합을 사용하여 게시 작업 실행.

이 튜토리얼은 다음을 가정합니다:

*   오픈소스 라이브러리를 생성하고 있습니다.
*   라이브러리 코드를 GitHub 저장소에 저장하고 있습니다.
*   macOS 또는 Linux를 사용하고 있습니다. Windows 사용자라면 [GnuPG 또는 Gpg4win](https://gnupg.org/download)을 사용하여 키 페어를 생성하세요.
*   Maven Central에 아직 등록되지 않았거나, [Central Portal에 게시하기](https://central.sonatype.org/publish-ea/publish-ea-guide/)에 적합한 기존 계정을 가지고 있습니다(2024년 3월 12일 이후 생성되었거나, 지원팀에 의해 Central Portal로 마이그레이션된 계정).
*   지속적 통합에 GitHub Actions를 사용하고 있습니다.

> 대부분의 단계는 다른 설정을 사용하더라도 여전히 적용되지만, 고려해야 할 몇 가지 차이점이 있을 수 있습니다.
>
> [중요한 제한 사항](multiplatform-publish-lib-setup.md#host-requirements)은 Apple 타겟이 macOS가 설치된 머신에서 빌드되어야 한다는 것입니다.
>
{style="note"}

## 샘플 라이브러리

이 튜토리얼에서는 [fibonacci](https://github.com/Kotlin/multiplatform-library-template/) 라이브러리를 예시로 사용합니다. 해당 저장소의 코드를 참조하여 게시 설정이 어떻게 작동하는지 확인할 수 있습니다.

코드를 재사용하고 싶다면, **모든 예시 값을** 프로젝트에 맞는 값으로 **반드시 교체해야 합니다**.

## 계정 및 자격 증명 준비

Maven Central에 게시를 시작하려면 [Maven Central](https://central.sonatype.com/) 포털에 로그인(또는 새 계정 생성)하세요.

### 네임스페이스 선택 및 확인

Maven Central에서 라이브러리 아티팩트를 고유하게 식별하려면 확인된 네임스페이스가 필요합니다.

Maven 아티팩트는 [좌표](https://central.sonatype.org/publish/requirements/#correct-coordinates)로 식별됩니다. 예를 들어, `com.example:fibonacci-library:1.0.0`과 같습니다. 이 좌표는 콜론으로 구분된 세 부분으로 구성됩니다:

*   `groupId`: 역-DNS 형식, 예: `com.example`
*   `artifactId`: 라이브러리 자체의 고유 이름, 예: `fibonacci-library`
*   `version`: 버전 문자열, 예: `1.0.0`. 버전은 어떤 문자열도 가능하지만, `-SNAPSHOT`으로 끝날 수 없습니다.

등록된 네임스페이스를 통해 Maven Central에서 `groupId`의 형식을 설정할 수 있습니다. 예를 들어, `com.example` 네임스페이스를 등록하면 `groupId`를 `com.example`, `com.example.libraryname`, `com.example.module.feature` 등으로 설정하여 아티팩트를 게시할 수 있습니다.

Maven Central에 로그인한 후, [네임스페이스](https://central.sonatype.com/publishing/namespaces) 페이지로 이동합니다. 그런 다음, **Add Namespace** 버튼을 클릭하고 네임스페이스를 등록합니다:

<tabs>
<tab id="github" title="GitHub 저장소 사용">

도메인 이름을 소유하고 있지 않다면 GitHub 계정을 사용하여 네임스페이스를 생성하는 것이 좋은 선택입니다:

1.  `io.github.<your username>`을 네임스페이스로 입력하고, 예를 들어 `io.github.kotlinhandson`을 입력한 후 **Submit**을 클릭합니다.
2.  새로 생성된 네임스페이스 아래에 표시된 **Verification Key**를 복사합니다.
3.  GitHub에서 사용한 사용자 이름으로 로그인하고, 확인 키를 저장소 이름으로 사용하여 새 공개 저장소를 생성합니다. 예를 들어, `http://github.com/kotlin-hands-on/ex4mpl3c0d`와 같습니다.
4.  Maven Central로 돌아가서 **Verify Namespace** 버튼을 클릭합니다. 확인이 성공하면 생성한 저장소를 삭제할 수 있습니다.

</tab>
<tab id="domain" title="도메인 이름 사용">

소유한 도메인 이름을 네임스페이스로 사용하려면:

1.  역-DNS 형식을 사용하여 도메인을 네임스페이스로 입력합니다. 도메인이 `example.com`이라면 `com.example`을 입력합니다.
2.  표시된 **Verification Key**를 복사합니다.
3.  확인 키를 내용으로 하는 새 TXT DNS 레코드를 생성합니다.

    다양한 도메인 등록 기관에서 이 작업을 수행하는 방법에 대한 자세한 내용은 [Maven Central의 FAQ](https://central.sonatype.org/faq/how-to-set-txt-record/)를 참조하세요.
4.  Maven Central로 돌아가서 **Verify Namespace** 버튼을 클릭합니다. 확인이 성공하면 생성한 TXT 레코드를 삭제할 수 있습니다.

</tab>
</tabs>

#### 키 페어 생성

Maven Central에 무엇인가를 게시하기 전에, 아티팩트의 출처를 사용자가 확인할 수 있도록 [PGP 서명](https://central.sonatype.org/publish/requirements/gpg/)으로 아티팩트에 서명해야 합니다.

서명을 시작하려면 키 페어를 생성해야 합니다:

*   _개인 키_는 아티팩트에 서명하는 데 사용되며, 절대로 다른 사람과 공유해서는 안 됩니다.
*   _공개 키_는 다른 사람과 공유하여 아티팩트의 서명을 확인할 수 있도록 합니다.

서명을 관리할 수 있는 `gpg` 도구는 [GnuPG 웹사이트](https://gnupg.org/download/index.html)에서 사용할 수 있습니다. [Homebrew](https://brew.sh/)와 같은 패키지 관리자를 사용하여 설치할 수도 있습니다:

```bash
brew install gpg
```

1.  다음 명령어를 사용하여 키 페어 생성을 시작하고, 프롬프트가 나타나면 필요한 세부 정보를 제공합니다:

    ```bash
    gpg --full-generate-key
    ```

2.  생성할 키 유형에 대해 권장되는 기본값을 선택합니다.
    선택 사항을 비워두고 <shortcut>Enter</shortcut>를 눌러 기본값을 수락할 수 있습니다.

    ```text
    Please select what kind of key you want:
        (1) RSA and RSA
        (2) DSA and Elgamal
        (3) DSA (sign only)
        (4) RSA (sign only)
        (9) ECC (sign and encrypt) *default*
        (10) ECC (sign only)
        (14) Existing key from card
    Your selection? 9
    
    Please select which elliptic curve you want:
        (1) Curve 25519 *default*
        (4) NIST P-384
        (6) Brainpool P-256
    Your selection? 1
    ```

    > 이 글을 작성하는 시점에는 `Curve 25519`를 사용하는 `ECC (sign and encrypt)`입니다.
    > `gpg`의 이전 버전은 `3072`비트 키 크기를 사용하는 `RSA`가 기본값일 수 있습니다.
    >
    {style="note"}

3.  키의 유효 기간을 지정하라는 메시지가 나타나면, 만료일이 없는 기본 옵션을 선택할 수 있습니다.

    일정 시간 후에 자동으로 만료되는 키를 생성하도록 선택하면, 만료 시 [유효 기간을 연장](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)해야 합니다.

    ```text
    Please specify how long the key should be valid.
        0 = key does not expire
        <n>  = key expires in n days
        <n>w = key expires in n weeks
        <n>m = key expires in n months
        <n>y = key expires in n years
    Key is valid for? (0) 0
    Key does not expire at all
    
    Is this correct? (y/N) y
    ```

4.  키를 ID와 연결하기 위해 이름, 이메일, 선택적 주석을 입력합니다(주석 필드는 비워둘 수 있습니다):

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5.  키를 암호화할 암호를 입력하고, 프롬프트가 나타나면 다시 입력합니다.

    이 암호는 안전하고 비공개적으로 보관하세요. 나중에 아티팩트에 서명할 때 개인 키에 액세스하는 데 필요합니다.

6.  다음 명령어를 사용하여 생성한 키를 확인합니다:

    ```bash
    gpg --list-keys
    ```

출력은 다음과 유사할 것입니다:

```text
pub   ed25519 2024-10-06 [SC]
      F175482952A225BFD4A07A713EE6B5F76620B385CE
uid   [ultimate] Jane Doe <janedoe@example.com>
      sub   cv25519 2024-10-06 [E]
```

다음 단계에서는 출력에 나타나는 키의 긴 영숫자 식별자를 사용해야 합니다.

#### 공개 키 업로드

Maven Central에서 승인되려면 [공개 키를 키 서버에 업로드](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)해야 합니다. 여러 키 서버가 있으며, `keyserver.ubuntu.com`을 기본 선택으로 사용합시다.

`gpg`를 사용하여 공개 키를 업로드하려면 다음 명령어를 실행하고, 매개변수에 **자신의 키 ID를 대체**하여 사용하세요:

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

#### 개인 키 내보내기

Gradle 프로젝트가 개인 키에 액세스할 수 있도록 하려면, 개인 키를 바이너리 파일로 내보내야 합니다.
키를 생성할 때 사용한 암호를 입력하라는 메시지가 나타납니다.

다음 명령어를 사용하고, 매개변수로 **자신의 키 ID를 전달**합니다:

```bash
gpg --no-armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

이 명령어는 개인 키를 포함하는 `key.gpg` 바이너리 파일을 생성합니다 (키의 일반 텍스트 버전만 생성하는 `--armor` 플래그를 **사용하지 않도록** 주의하세요).

> 개인 키 파일은 절대 다른 사람과 공유하지 마세요. 개인 키는 자격 증명으로 파일에 서명하는 것을 가능하게 하므로, 오직 자신만 접근할 수 있어야 합니다.
>
{style="warning"}

## 프로젝트 구성

### 라이브러리 프로젝트 준비

템플릿 프로젝트에서 라이브러리 개발을 시작했다면, 이제 프로젝트의 모든 기본 이름을 자신의 라이브러리 이름과 일치하도록 변경하기에 좋은 시기입니다. 여기에는 라이브러리 모듈의 이름과 최상위 `build.gradle.kts` 파일의 루트 프로젝트 이름이 포함됩니다.

프로젝트에 Android 타겟이 있다면, [Android 라이브러리 릴리스를 준비하는 단계](https://developer.android.com/build/publish-library/prep-lib-release)를 따라야 합니다. 최소한 이 과정에서는 라이브러리에 [적절한 네임스페이스를 지정](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)해야 해당 리소스가 컴파일될 때 고유한 `R` 클래스가 생성됩니다. 이 네임스페이스는 [앞서 생성한](#choose-and-verify-a-namespace) Maven 네임스페이스와 다릅니다.

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 게시 플러그인 설정

이 튜토리얼은 Maven Central로의 게시를 돕기 위해 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin)을 사용합니다.
플러그인의 장점에 대해 [여기](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)에서 더 자세히 읽을 수 있습니다.
플러그인의 사용법 및 사용 가능한 구성 옵션에 대해 자세히 알아보려면 [플러그인 문서](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)를 참조하세요.

프로젝트에 플러그인을 추가하려면 라이브러리 모듈의 `build.gradle.kts` 파일에 있는 `plugins {}` 블록에 다음 줄을 추가합니다:

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "0.30.0" 
}
```

> 플러그인의 최신 버전을 확인하려면 [릴리스 페이지](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)를 참조하세요.
>
{style="note"}

같은 파일에 다음 구성을 추가하고, 라이브러리에 맞게 모든 값을 사용자 지정해야 합니다:

```kotlin
// <module directory>/build.gradle.kts

mavenPublishing {
    publishToMavenCentral(SonatypeHost.CENTRAL_PORTAL)
    
    signAllPublications()
    
    coordinates(group.toString(), "fibonacci", version.toString())
    
    pom { 
        name = "Fibonacci library"
        description = "A mathematics calculation library."
        inceptionYear = "2024"
        url = "https://github.com/kotlin-hands-on/fibonacci/"
        licenses {
            license {
                name = "The Apache License, Version 2.0"
                url = "https://www.apache.org/licenses/LICENSE-2.0.txt"
                distribution = "https://www.apache.org/licenses/LICENSE-2.0.txt"
            }
        }
        developers {
            developer {
                id = "kotlin-hands-on"
                name = "Kotlin Developer Advocate"
                url = "https://github.com/kotlin-hands-on/"
            }
        }
        scm {
            url = "https://github.com/kotlin-hands-on/fibonacci/"
            connection = "scm:git:git://github.com/kotlin-hands-on/fibonacci.git"
            developerConnection = "scm:git:ssh://git@github.com/kotlin-hands-on/fibonacci.git"
        }
    }
}
```

> 이를 구성하기 위해 [Gradle 속성](https://docs.gradle.org/current/userguide/build_environment.html)을 사용할 수도 있습니다.
>
{style="tip"}

여기서 가장 중요한 설정은 다음과 같습니다:

*   라이브러리의 `groupId`, `artifactId`, `version`을 지정하는 `coordinates`.
*   라이브러리가 게시되는 [라이선스](https://central.sonatype.org/publish/requirements/#license-information).
*   라이브러리 작성자를 나열하는 [개발자 정보](https://central.sonatype.org/publish/requirements/#developer-information).
*   라이브러리의 소스 코드가 호스팅되는 위치를 지정하는 [SCM (Source Code Management) 정보](https://central.sonatype.org/publish/requirements/#scm-information).

## 지속적 통합을 사용하여 Maven Central에 게시

### 사용자 토큰 생성

Maven Central이 게시 요청을 승인하려면 Maven 액세스 토큰이 필요합니다.
[Setup Token-Based Authentication](https://central.sonatype.com/account) 페이지를 열고 **Generate User Token** 버튼을 클릭합니다.

출력은 아래 예시와 같이 사용자 이름과 암호를 포함합니다. 이 자격 증명을 잃어버리면 Maven Central에 저장되지 않으므로 나중에 새 자격 증명을 생성해야 합니다.

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### GitHub에 시크릿 추가

GitHub Actions 워크플로우에서 게시하는 데 필요한 키와 자격 증명을 비공개로 유지하면서 사용하려면, 이 값들을 시크릿으로 저장해야 합니다.

1.  GitHub 저장소 **Settings** 페이지에서 **Security** | **Secrets and variables** | **Actions**를 클릭합니다.
2.  `New repository secret` 버튼을 클릭하고 다음 시크릿을 추가합니다:

    *   `MAVEN_CENTRAL_USERNAME` 및 `MAVEN_CENTRAL_PASSWORD`는 Central Portal 웹사이트에서 [사용자 토큰에 대해 생성된](#generate-the-user-token) 값입니다.
    *   `SIGNING_KEY_ID`는 서명 키 식별자의 **마지막 8자리**입니다. 예를 들어, `F175482952A225BFC4A07A715EE6B5F76620B385CE`의 경우 `20B385CE`입니다.
    *   `SIGNING_PASSWORD`는 GPG 키를 생성할 때 제공한 암호입니다.
    *   `GPG_KEY_CONTENTS`에는 [자신의 `key.gpg` 파일](#export-your-private-key)의 전체 내용이 포함되어야 합니다.

    ![GitHub에 시크릿 추가](github_secrets.png){width=700}

다음 단계의 CI 구성에서 이 시크릿의 이름을 사용할 것입니다.

### 프로젝트에 GitHub Actions 워크플로우 추가

라이브러리를 자동으로 빌드하고 게시하기 위해 지속적 통합을 설정할 수 있습니다.
여기서는 [GitHub Actions](https://docs.github.com/en/actions)를 예시로 사용합니다.

시작하려면, `.github/workflows/publish.yml` 파일에 다음 워크플로우를 저장소에 추가합니다:

```yaml
# .github/workflows/publish.yml

name: Publish
on:
  release:
    types: [released, prereleased]
jobs:
  publish:
    name: Release build and publish
    runs-on: macOS-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 21
      - name: Publish to MavenCentral
        run: ./gradlew publishToMavenCentral --no-configuration-cache
        env:
          ORG_GRADLE_PROJECT_mavenCentralUsername: ${{ secrets.MAVEN_CENTRAL_USERNAME }}
          ORG_GRADLE_PROJECT_mavenCentralPassword: ${{ secrets.MAVEN_CENTRAL_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyId: ${{ secrets.SIGNING_KEY_ID }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyPassword: ${{ secrets.SIGNING_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKey: ${{ secrets.GPG_KEY_CONTENTS }}
```

이 파일을 커밋하고 푸시하면, 프로젝트를 호스팅하는 GitHub 저장소에서 릴리스(사전 릴리스 포함)를 생성할 때마다 워크플로우가 자동으로 실행됩니다. 워크플로우는 현재 코드 버전을 체크아웃하고, JDK를 설정한 다음, `publishToMavenCentral` Gradle 작업을 실행합니다.

`publishToMavenCentral` 작업을 사용할 때에도 Maven Central 웹사이트에서 배포를 수동으로 확인하고 [릴리스해야](#create-a-release-on-github) 합니다. 또는 `publishAndReleaseToMavenCentral` 작업을 사용하여 릴리스 프로세스를 완전히 자동화할 수 있습니다.

또한, 워크플로우를 저장소에 [태그가 푸시될 때 트리거되도록](https://stackoverflow.com/a/61892639) 구성할 수도 있습니다.

> 위 스크립트는 게시 플러그인이 구성 캐시를 지원하지 않으므로 (이 [오픈 이슈](https://github.com/gradle/gradle/issues/22779) 참조), Gradle 명령어에 `--no-configuration-cache`를 추가하여 게시 작업에 대한 Gradle [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)를 비활성화합니다.
>
{style="tip"}

이 작업에는 서명 세부 정보와 [저장소 시크릿으로 생성한](#add-secrets-to-github) Maven Central 자격 증명이 필요합니다.

워크플로우 구성은 이 시크릿을 환경 변수로 자동으로 전송하여 Gradle 빌드 프로세스에서 사용할 수 있도록 합니다.

### GitHub에서 릴리스 생성

워크플로우와 시크릿이 설정되었으므로, 이제 라이브러리 게시를 트리거할 [릴리스를 생성](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)할 준비가 되었습니다.

1.  라이브러리의 `build.gradle.kts` 파일에 지정된 버전 번호가 게시하려는 버전과 일치하는지 확인합니다.
2.  GitHub 저장소의 기본 페이지로 이동합니다.
3.  오른쪽 사이드바에서 **Releases**를 클릭합니다.
4.  **Draft a new release** 버튼(이전에 이 저장소에 릴리스를 생성한 적이 없다면 **Create a new release** 버튼)을 클릭합니다.
5.  각 릴리스에는 태그가 있습니다. 태그 드롭다운에서 새 태그를 생성하고 릴리스 제목을 설정합니다(태그 이름과 제목은 동일할 수 있습니다).

    이 값들은 `build.gradle.kts` 파일에 지정한 라이브러리의 버전 번호와 동일하게 설정하는 것이 좋습니다.

    ![GitHub에서 릴리스 생성](create_release_and_tag.png){width=700}

6.  릴리스 대상으로 할 브랜치를 다시 확인하고(기본 브랜치가 아닌 경우 특히), 새 버전에 대한 적절한 릴리스 노트를 추가합니다.
7.  설명 아래의 체크박스를 사용하여 릴리스를 사전 릴리스(알파, 베타 또는 RC와 같은 초기 액세스 버전에 유용)로 표시합니다.

    또한, 릴리스를 최신 릴리스로 표시할 수도 있습니다(이전에 이 저장소에 릴리스를 생성한 적이 있는 경우).
8.  **Publish release** 버튼을 클릭하여 새 릴리스를 생성합니다.
9.  GitHub 저장소 페이지 상단의 **Actions** 탭을 클릭합니다. 여기에서 새 릴리스가 게시 워크플로우를 트리거한 것을 볼 수 있습니다.

    워크플로우를 클릭하여 게시 작업의 출력을 확인할 수 있습니다.
10. 워크플로우 실행이 완료되면 Maven Central의 [Deployments](https://central.sonatype.com/publishing/deployments) 대시보드로 이동합니다. 여기에 새 배포가 표시될 것입니다.

    이 배포는 Maven Central이 검사를 수행하는 동안 한동안 _pending_ 또는 _validating_ 상태로 유지될 수 있습니다.

11. 배포가 _validated_ 상태가 되면, 업로드한 모든 아티팩트가 포함되어 있는지 확인합니다.
    모든 것이 올바르면 **Publish** 버튼을 클릭하여 이 아티팩트들을 릴리스합니다.

    ![게시 설정](published_on_maven_central.png){width=700}

    > 릴리스 후 아티팩트가 Maven Central 저장소에 공개적으로 사용 가능해지기까지는 시간이 걸립니다(보통 15~30분 정도). [Maven Central 웹사이트](https://central.sonatype.com/)에서 색인화되고 검색 가능해지기까지는 더 오래 걸릴 수 있습니다.
    >
    {style="tip"}

배포가 확인되면 아티팩트를 자동으로 릴리스하려면, 워크플로우에서 `publishToMavenCentral` 작업을 `publishAndReleaseToMavenCentral`로 교체하세요.

## 다음 단계

*   [멀티플랫폼 라이브러리 게시 설정 및 요구 사항에 대해 자세히 알아보기](multiplatform-publish-lib-setup.md)
*   [README에 shield.io 배지 추가하기](https://shields.io/badges/maven-central-version)
*   [Dokka를 사용하여 프로젝트 API 문서 공유하기](https://kotl.in/dokka)
*   [Renovate를 추가하여 종속성 자동 업데이트하기](https://docs.renovatebot.com/)
*   [JetBrains의 검색 플랫폼에서 라이브러리 홍보하기](https://klibs.io/)
*   [#feed Kotlin Slack 채널에서 커뮤니티와 라이브러리 공유하기](https://kotlinlang.slack.com/)
    (가입하려면 https://kotl.in/slack 방문)