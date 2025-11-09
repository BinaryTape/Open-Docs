[//]: # (title: Maven Central에 라이브러리 게시하기 – 튜토리얼)

이 튜토리얼에서는 Kotlin Multiplatform 라이브러리를 [Maven Central](https://central.sonatype.com/) 저장소에 게시하는 방법을 배웁니다.

라이브러리를 게시하려면 다음을 수행해야 합니다.

1.  Maven Central 계정과 서명에 사용할 PGP 키를 포함한 자격 증명을 설정합니다.
2.  라이브러리 프로젝트에서 게시 플러그인을 구성합니다.
3.  게시 플러그인이 아티팩트에 서명하고 업로드할 수 있도록 자격 증명을 제공합니다.
4.  로컬 또는 지속적 통합을 사용하여 게시 작업을 실행합니다.

이 튜토리얼은 다음을 가정합니다:

*   오픈소스 라이브러리를 생성하고 있습니다.
*   라이브러리 코드를 GitHub 저장소에 저장하고 있습니다.
*   macOS 또는 Linux를 사용 중입니다. Windows 사용자라면 [GnuPG 또는 Gpg4win](https://gnupg.org/download)을 사용하여 키 쌍을 생성하세요.
*   아직 Maven Central에 등록하지 않았거나, [Central Portal에 게시](https://central.sonatype.org/publish-ea/publish-ea-guide/)하기에 적합한 기존 계정(2024년 3월 12일 이후에 생성되었거나 지원팀을 통해 Central Portal로 마이그레이션된 계정)을 가지고 있습니다.
*   지속적 통합을 위해 GitHub Actions를 사용하고 있습니다.

> 여기 있는 대부분의 단계는 다른 설정을 사용하는 경우에도 여전히 적용되지만, 고려해야 할 몇 가지 차이점이 있을 수 있습니다.
> 
> [중요한 제한 사항](multiplatform-publish-lib-setup.md#host-requirements)은 Apple 타겟이 macOS가 설치된 머신에서 빌드되어야 한다는 것입니다.
> 
{style="note"}

## 샘플 라이브러리

이 튜토리얼에서는 [fibonacci](https://github.com/Kotlin/multiplatform-library-template/) 라이브러리를 예시로 사용합니다. 해당 저장소의 코드를 참조하여 게시 설정이 어떻게 작동하는지 확인할 수 있습니다.

코드를 재사용하고 싶다면, **모든 예시 값을 프로젝트에 맞는 값으로 바꿔야 합니다**.

## 계정 및 자격 증명 준비

Maven Central에 게시를 시작하려면 [Maven Central](https://central.sonatype.com/) 포털에 로그인(또는 새 계정 생성)하세요.

### 네임스페이스 선택 및 확인

Maven Central에서 라이브러리 아티팩트를 고유하게 식별하려면 확인된 네임스페이스가 필요합니다.

Maven 아티팩트는 [좌표](https://central.sonatype.org/publish/requirements/#correct-coordinates)로 식별됩니다. 예를 들어, `com.example:fibonacci-library:1.0.0`과 같습니다. 이러한 좌표는 콜론으로 구분된 세 부분으로 구성됩니다.

*   `groupId`: 역 DNS 형식으로, 예를 들어 `com.example`
*   `artifactId`: 라이브러리 자체의 고유 이름으로, 예를 들어 `fibonacci-library`
*   `version`: 버전 문자열로, 예를 들어 `1.0.0`. 버전은 어떤 문자열이든 될 수 있지만 `-SNAPSHOT`으로 끝날 수 없습니다.

등록된 네임스페이스는 Maven Central에서 `groupId`의 형식을 설정할 수 있도록 합니다. 예를 들어, `com.example` 네임스페이스를 등록하면 `groupId`를 `com.example`, `com.example.libraryname`, `com.example.module.feature` 등으로 설정하여 아티팩트를 게시할 수 있습니다.

Maven Central에 로그인한 후 [네임스페이스](https://central.sonatype.com/publishing/namespaces) 페이지로 이동합니다. 그런 다음, **Add Namespace** 버튼을 클릭하고 네임스페이스를 등록합니다.

<Tabs>
<TabItem id="github" title="GitHub 저장소 사용">

GitHub 계정을 사용하여 네임스페이스를 생성하는 것은 도메인 이름을 소유하고 있지 않을 때 좋은 옵션입니다.

1.  네임스페이스로 `io.github.<your username>`을 입력합니다. 예를 들어 `io.github.kotlinhandson`을 입력하고 **Submit**을 클릭합니다.
2.  새로 생성된 네임스페이스 아래에 표시된 **Verification Key**를 복사합니다.
3.  GitHub에서 사용한 사용자 이름으로 로그인하고, 인증 키를 저장소 이름으로 사용하여 새 공개 저장소를 생성합니다. 예를 들어 `http://github.com/kotlin-hands-on/ex4mpl3c0d`와 같습니다.
4.  Maven Central로 돌아가서 **Verify Namespace** 버튼을 클릭합니다. 확인에 성공하면 생성했던 저장소를 삭제할 수 있습니다.

</TabItem>
<TabItem id="domain" title="도메인 이름 사용">

소유한 도메인 이름을 네임스페이스로 사용하려면 다음을 수행합니다.

1.  역 DNS 형식으로 도메인을 네임스페이스로 입력합니다. 도메인이 `example.com`이라면 `com.example`을 입력합니다.
2.  표시된 **Verification Key**를 복사합니다.
3.  인증 키를 내용으로 하는 새 TXT DNS 레코드를 생성합니다.

    다양한 도메인 등록기관에서 이 작업을 수행하는 방법에 대한 자세한 내용은 [Maven Central의 FAQ](https://central.sonatype.com/faq/how-to-set-txt-record/)를 참조하세요.
4.  Maven Central로 돌아가서 **Verify Namespace** 버튼을 클릭합니다. 확인에 성공하면 생성했던 TXT 레코드를 삭제할 수 있습니다.

</TabItem>
</Tabs>

#### 키 쌍 생성

Maven Central에 무언가를 게시하기 전에 아티팩트에 [PGP 서명](https://central.sonatype.org/publish/requirements/gpg/)을 해야 합니다. 이는 사용자가 아티팩트의 출처를 확인할 수 있도록 합니다.

서명을 시작하려면 키 쌍을 생성해야 합니다.

*   _개인 키_는 아티팩트에 서명하는 데 사용되며 다른 사람과 공유해서는 안 됩니다.
*   _공개 키_는 다른 사람과 공유하여 아티팩트의 서명을 확인할 수 있도록 합니다.

<Tabs group ="key-pair-tools">
<TabItem title="Kotlin Gradle 플러그인 사용" group-key="kgp">

Kotlin Gradle 플러그인에는 키 쌍을 생성하는 데 사용할 수 있는 Gradle 태스크가 있습니다.

1.  다음 명령어를 사용하여 키 쌍을 생성합니다. 개인 키 저장소의 비밀번호와 다음 형식으로 이름을 제공하세요.

    ```bash
    ./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
    ```

    키 쌍은 `build/pgp` 디렉터리에 저장됩니다.

2.  우발적인 삭제나 무단 접근을 방지하기 위해 `build/pgp` 디렉터리에서 안전한 위치로 키 쌍을 이동하세요.

</TabItem>
<TabItem title="gpg 도구 사용" group-key="gpg">

서명을 관리할 수 있는 `gpg` 도구는 [GnuPG 웹사이트](https://gnupg.org/download/index.html)에서 사용할 수 있습니다. [Homebrew](https://brew.sh/)와 같은 패키지 관리자를 사용하여 설치할 수도 있습니다.

```bash
brew install gpg
```

1.  다음 명령어를 사용하여 키 쌍 생성을 시작하고 프롬프트가 나타나면 필요한 세부 정보를 제공합니다.

    ```bash
    gpg --full-generate-key
    ```

2.  생성할 키 유형에 대해 권장되는 기본값을 선택합니다. 선택 사항을 비워두고 <shortcut>Enter</shortcut>를 눌러 기본값을 수락할 수 있습니다.

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

    > 이 글을 쓰는 시점에는 `Curve 25519`와 함께 `ECC (sign and encrypt)`가 사용됩니다.
    > `gpg`의 이전 버전은 `3072`비트 키 크기의 `RSA`가 기본값일 수 있습니다.
    > 
    {style="note"}

3.  키가 유효한 기간을 지정하라는 메시지가 나타나면 만료일이 없는 기본 옵션을 선택할 수 있습니다.

    특정 기간 후에 자동으로 만료되는 키를 생성하도록 선택하면, 만료 시 [유효 기간을 연장](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)해야 합니다.

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

4.  키를 ID와 연결할 이름, 이메일, 선택 사항인 주석을 입력합니다(주석 필드는 비워둘 수 있습니다).

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5.  키를 암호화할 암호를 입력하고 프롬프트가 나타나면 다시 반복합니다.

    이 암호는 안전하고 비공개적으로 보관하세요. 나중에 아티팩트에 서명할 때 개인 키에 접근하는 데 필요합니다.

6.  다음 명령어를 사용하여 생성한 키를 확인합니다.

    ```bash
    gpg --list-keys
    ```

    출력은 다음과 유사하게 표시됩니다.

    ```text
    pub   ed25519 2024-10-06 [SC]
          F175482952A225BFD4A07A713EE6B5F76620B385CE
    uid   [ultimate] Jane Doe <janedoe@example.com>
          sub   cv25519 2024-10-06 [E]
    ```

    다음 단계에서는 출력에 나타나는 키의 긴 영숫자 식별자를 사용해야 합니다.

</TabItem>
</Tabs>

#### 공개 키 업로드

Maven Central에서 공개 키를 수락하려면 [키 서버에 공개 키를 업로드](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)해야 합니다. 여러 키 서버가 있으며, `keyserver.ubuntu.com`을 기본 선택으로 사용하겠습니다.

<Tabs group ="key-pair-tools">
<TabItem title="Kotlin Gradle 플러그인 사용" group-key="kgp">

Kotlin Gradle 플러그인에는 공개 키를 업로드하는 데 사용할 수 있는 Gradle 태스크가 있습니다.

다음 명령어를 실행하여 공개 키의 경로를 제공하며 업로드하세요.

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

</TabItem>
<TabItem title="gpg 도구 사용" group-key="gpg">

Maven Central에서 공개 키를 수락하려면 [키 서버에 공개 키를 업로드](https://central.sonatype.com/publish/requirements/gpg/#distributing-your-public-key)해야 합니다. 여러 키 서버가 있으며, `keyserver.ubuntu.com`을 기본 선택으로 사용하겠습니다.

`gpg`를 사용하여 공개 키를 업로드하려면 다음 명령어를 실행하고, 매개변수에 **자신의 키 ID를 대체**하세요.

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

**개인 키 내보내기** {id="export-your-private-key"}

Gradle 프로젝트가 개인 키에 접근할 수 있도록 하려면, 개인 키를 바이너리 파일로 내보내야 합니다. 키를 생성할 때 사용한 암호를 입력하라는 메시지가 나타날 것입니다.

다음 명령어를 사용하고, 매개변수로 **자신의 키 ID를 전달**하세요.

```bash
gpg --no-armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

이 명령어는 개인 키가 포함된 `key.gpg` 바이너리 파일을 생성합니다(`--armor` 플래그는 키의 일반 텍스트 버전만 생성하므로 사용하지 않도록 주의하세요).

> 개인 키 파일은 절대로 누구와도 공유하지 마세요. 개인 키는 여러분의 자격 증명으로 파일에 서명할 수 있도록 하므로, 오직 여러분만 접근할 수 있어야 합니다.
> 
{style="warning"}

</TabItem>
</Tabs>

## 프로젝트 구성

### 라이브러리 프로젝트 준비

템플릿 프로젝트에서 라이브러리 개발을 시작했다면, 이제 프로젝트의 기본 이름을 라이브러리 자체의 이름과 일치하도록 변경하는 것이 좋습니다. 여기에는 라이브러리 모듈의 이름과 최상위 `build.gradle.kts` 파일의 루트 프로젝트 이름이 포함됩니다.

프로젝트에 Android 타겟이 있는 경우, [Android 라이브러리 릴리스 준비 단계](https://developer.android.com/build/publish-library/prep-lib-release)를 따라야 합니다. 최소한 이 과정에서는 라이브러리의 리소스가 컴파일될 때 고유한 `R` 클래스가 생성되도록 [적절한 네임스페이스를 지정](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)해야 합니다. 이 네임스페이스는 이전에 [생성한](#choose-and-verify-a-namespace) Maven 네임스페이스와 다르다는 점에 유의하세요.

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 게시 플러그인 설정

이 튜토리얼에서는 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin)을 사용하여 Maven Central에 게시를 지원합니다. 플러그인의 장점에 대해 [여기](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)에서 자세히 읽을 수 있습니다. 플러그인의 사용법 및 사용 가능한 구성 옵션에 대한 자세한 내용은 [플러그인 문서](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)를 참조하세요.

프로젝트에 플러그인을 추가하려면 라이브러리 모듈의 `build.gradle.kts` 파일에 있는 `plugins {}` 블록에 다음 줄을 추가합니다.

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%" 
}
```

> 플러그인의 최신 버전을 확인하려면 [릴리스 페이지](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)를 참조하세요.
> 
{style="note"}

같은 파일에 다음 구성을 추가하고, 라이브러리에 대한 모든 값을 사용자 지정했는지 확인하세요.

```kotlin
// <module directory>/build.gradle.kts

mavenPublishing {
    publishToMavenCentral()
    
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

> 이를 구성하려면 [Gradle 속성](https://docs.gradle.org/current/userguide/build_environment.html)을 사용할 수도 있습니다.
> 
{style="tip"}

여기서 가장 중요한 설정은 다음과 같습니다.

*   `coordinates`: 라이브러리의 `groupId`, `artifactId`, `version`을 지정합니다.
*   [license](https://central.sonatype.org/publish/requirements/#license-information): 라이브러리가 게시되는 라이선스입니다.
*   [developer information](https://central.sonatype.org/publish/requirements/#developer-information): 라이브러리 저자를 나열합니다.
*   [SCM (Source Code Management) information](https://central.sonatype.org/publish/requirements/#scm-information): 라이브러리의 소스 코드가 호스팅되는 위치를 지정합니다.

### 로컬 확인 실행

Maven Central에 게시하기 전에 프로젝트가 올바르게 구성되었는지 로컬에서 확인하는 것이 좋습니다.

#### 로컬에서 서명 확인

다음 명령어를 실행하여 키가 서명에 올바르게 구성되었는지 확인하세요.

```bash
./gradlew checkSigningConfiguration
```

이 Gradle 태스크는 공개 키가 `keyserver.ubuntu.com` 또는 `keys.openpgp.org` 키 서버 중 하나에 업로드되었는지 확인합니다.

태스크가 오류를 보고하면 출력을 검토하여 수정 방법에 대한 세부 정보를 확인하세요.

#### 로컬에서 `pom.xml` 파일 확인

Maven Central에 라이브러리를 게시하려면 `pom.xml` 파일이 Maven Central의 [요구 사항](https://central.sonatype.org/publish/requirements/#required-pom-metadata)을 충족해야 합니다.

게시하려는 각 라이브러리에 대해 다음 명령어를 실행하고 `<PUBLICATION_NAME>`을 게시 이름으로 바꾸세요.

```bash
./gradlew checkPomFileFor<PUBLICATION_NAME>Publication
```

[vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin)의 경우, 게시 이름은 일반적으로 `Maven`입니다. 이 경우 태스크는 다음과 같습니다.

```bash
./gradlew checkPomFileForMavenPublication
```

태스크가 오류를 보고하면 출력을 검토하여 수정 방법에 대한 세부 정보를 확인하세요.

## 지속적 통합을 사용하여 Maven Central에 게시

### 사용자 토큰 생성

Maven Central에 게시 요청을 승인하려면 Maven 액세스 토큰이 필요합니다. [토큰 기반 인증 설정](https://central.sonatype.com/usertoken) 페이지를 열고 **Generate User Token** 버튼을 클릭합니다.

출력은 아래 예시와 같이 사용자 이름과 암호를 포함합니다. 이 자격 증명을 분실하면 Maven Central에 저장되지 않으므로 나중에 새 자격 증명을 생성해야 합니다.

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### GitHub에 시크릿 추가

GitHub Actions 워크플로에서 게시하는 데 필요한 키와 자격 증명을 비공개로 유지하면서 사용하려면 이 값들을 시크릿으로 저장해야 합니다.

1.  GitHub 저장소 **Settings** 페이지에서 **Security** | **Secrets and variables** | **Actions**를 클릭합니다.
2.  `New repository secret` 버튼을 클릭하고 다음 시크릿을 추가합니다.

    *   `MAVEN_CENTRAL_USERNAME` 및 `MAVEN_CENTRAL_PASSWORD`는 Central Portal 웹사이트에서 [사용자 토큰을 생성](#generate-the-user-token)하여 얻은 값입니다.
    *   `SIGNING_KEY_ID`는 서명 키 식별자의 **마지막 8자리 문자**입니다. 예를 들어 `F175482952A225BFC4A07A715EE6B5F76620B385CE`의 경우 `20B385CE`입니다.
    *   `SIGNING_PASSWORD`는 GPG 키를 생성할 때 제공한 암호입니다.
    *   `GPG_KEY_CONTENTS`에는 [사용자의 `key.gpg` 파일](#export-your-private-key)의 전체 내용이 포함되어야 합니다.

    ![Add secrets to GitHub](github_secrets.png){width=700}

다음 단계에서 CI 구성에 이러한 시크릿의 이름을 사용할 것입니다.

### 프로젝트에 GitHub Actions 워크플로 추가

라이브러리를 자동으로 빌드하고 게시하도록 지속적 통합을 설정할 수 있습니다. [GitHub Actions](https://docs.github.com/en/actions)를 예시로 사용하겠습니다.

시작하려면 저장소의 `.github/workflows/publish.yml` 파일에 다음 워크플로를 추가합니다.

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

이 파일을 커밋하고 푸시하면 프로젝트를 호스팅하는 GitHub 저장소에서 릴리스(사전 릴리스 포함)를 생성할 때마다 워크플로가 자동으로 실행됩니다. 워크플로는 현재 코드 버전을 체크아웃하고, JDK를 설정한 다음, `publishToMavenCentral` Gradle 작업을 실행합니다.

`publishToMavenCentral` 작업을 사용할 때에도 Maven Central 웹사이트에서 배포를 수동으로 확인하고 [릴리스](#create-a-release-on-github)해야 합니다. 또는 `publishAndReleaseToMavenCentral` 작업을 사용하여 릴리스 프로세스를 완전히 자동화할 수 있습니다.

저장소에 [태그가 푸시될 때 워크플로가 트리거되도록](https://stackoverflow.com/a/61892639) 구성할 수도 있습니다.

> 위의 스크립트는 게시 플러그인이 지원하지 않으므로(`열린 이슈`를 참조하세요) Gradle [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)를 `—no-configuration-cache`를 Gradle 명령에 추가하여 게시 작업에 대해 비활성화합니다.
> 
{style="tip"}

이 작업에는 서명 정보와 [저장소 시크릿으로](#add-secrets-to-github) 생성한 Maven Central 자격 증명이 필요합니다.

워크플로 구성은 이러한 시크릿을 환경 변수로 자동으로 전송하여 Gradle 빌드 프로세스에서 사용할 수 있도록 합니다.

### GitHub에서 릴리스 생성

워크플로와 시크릿이 설정되었으므로 이제 라이브러리 게시를 트리거할 [릴리스를 생성](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)할 준비가 되었습니다.

1.  라이브러리의 `build.gradle.kts` 파일에 지정된 버전 번호가 게시하려는 버전인지 확인합니다.
2.  GitHub 저장소의 기본 페이지로 이동합니다.
3.  오른쪽 사이드바에서 **Releases**를 클릭합니다.
4.  **Draft a new release** 버튼(이 저장소에 이전에 릴리스를 생성한 적이 없는 경우 **Create a new release** 버튼)을 클릭합니다.
5.  각 릴리스에는 태그가 있습니다. 태그 드롭다운에서 새 태그를 생성하고 릴리스 제목을 설정합니다(태그 이름과 제목은 동일할 수 있습니다).

    이 값들은 `build.gradle.kts` 파일에 지정한 라이브러리 버전 번호와 동일하게 하는 것이 좋습니다.

    ![Create a release on GitHub](create_release_and_tag.png){width=700}

6.  릴리스 대상으로 지정하려는 브랜치(특히 기본 브랜치가 아닌 경우)를 다시 확인하고 새 버전에 대한 적절한 릴리스 노트를 추가합니다.
7.  설명 아래의 체크박스를 사용하여 릴리스를 사전 릴리스(알파, 베타 또는 RC와 같은 초기 접근 버전에 유용)로 표시합니다.

    이 저장소에 이전에 릴리스를 만들었다면 릴리스를 최신 릴리스로 표시할 수도 있습니다.
8.  **Publish release** 버튼을 클릭하여 새 릴리스를 생성합니다.
9.  GitHub 저장소 페이지 상단의 **Actions** 탭을 클릭합니다. 여기에서 새 릴리스가 게시 워크플로를 트리거했음을 볼 수 있습니다.

    워크플로를 클릭하여 게시 작업의 출력을 볼 수 있습니다.
10. 워크플로 실행이 완료되면 Maven Central의 [배포](https://central.sonatype.com/publishing/deployments) 대시보드로 이동합니다. 여기에 새 배포가 표시되어야 합니다.

    이 배포는 Maven Central이 검사를 수행하는 동안 한동안 _pending_ 또는 _validating_ 상태로 유지될 수 있습니다.

11. 배포가 _validated_ 상태가 되면 업로드한 모든 아티팩트가 포함되어 있는지 확인합니다. 모든 것이 올바르다면 **Publish** 버튼을 클릭하여 이러한 아티팩트를 릴리스합니다.

    ![Publishing settings](published_on_maven_central.png){width=700}

    > 아티팩트가 Maven Central 저장소에 공개적으로 사용 가능하게 되려면 릴리스 후 시간이 걸립니다(일반적으로 15-30분이지만 몇 시간까지 걸릴 수 있습니다). [Maven Central 웹사이트](https://central.sonatype.com/)에서 색인화되어 검색 가능하게 되는 데는 더 오래 걸릴 수 있습니다.
    > 
{style="tip"}

배포가 확인되면 아티팩트를 자동으로 릴리스하려면 워크플로에서 `publishToMavenCentral` 작업을 `publishAndReleaseToMavenCentral`로 바꿉니다.

## 다음 단계

*   [멀티플랫폼 라이브러리 게시 설정 및 요구 사항에 대해 자세히 알아보기](multiplatform-publish-lib-setup.md)
*   [README에 shield.io 배지 추가하기](https://shields.io/badges/maven-central-version)
*   [Dokka를 사용하여 프로젝트 API 문서 공유하기](https://kotl.in/dokka)
*   [종속성을 자동으로 업데이트하도록 Renovate 추가하기](https://docs.renovatebot.com/)
*   [JetBrains의 검색 플랫폼에서 라이브러리 홍보하기](https://klibs.io/)
*   [Kotlin Slack 채널 `#feed`에서 커뮤니티와 라이브러리 공유하기](https://kotlinlang.slack.com/)
    (가입하려면 https://kotl.in/slack 방문)