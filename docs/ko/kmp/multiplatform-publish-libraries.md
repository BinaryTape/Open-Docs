[//]: # (title: 라이브러리를 Maven Central에 배포하기 – 튜토리얼)

이 튜토리얼에서는 코틀린 멀티플랫폼(Kotlin Multiplatform) 라이브러리를 [Maven Central](https://central.sonatype.com/) 저장소에 배포하는 방법을 알아봅니다.

라이브러리를 배포하려면 다음 단계가 필요합니다:

1. Maven Central 계정과 서명을 위한 PGP 키를 포함한 자격 증명(credentials)을 설정합니다.
2. 라이브러리 프로젝트에서 배포 플러그인을 구성합니다.
3. 배포 플러그인이 아티팩트(artifacts)에 서명하고 업로드할 수 있도록 자격 증명을 제공합니다.
4. 로컬 또는 지속적 통합(CI)을 사용하여 배포 태스크를 실행합니다.

이 튜토리얼은 독자가 다음과 같은 상황임을 가정합니다:

* 오픈 소스 라이브러리를 제작하고 있습니다.
* 라이브러리 코드를 GitHub 저장소에 보관하고 있습니다.
* macOS 또는 Linux를 사용하고 있습니다. Windows 사용자의 경우, [GnuPG 또는 Gpg4win](https://gnupg.org/download)을 사용하여 키 쌍을 생성하세요.
* Maven Central에 아직 등록되지 않았거나, [Central Portal로 배포](https://central.sonatype.org/publish-ea/publish-ea-guide/)하기에 적합한 기존 계정(2024년 3월 12일 이후 생성되었거나 지원팀을 통해 Central Portal로 마이그레이션된 계정)을 보유하고 있습니다.
* 지속적 통합을 위해 GitHub Actions를 사용하고 있습니다.

> 사용 중인 설정이 다르더라도 대부분의 단계는 그대로 적용 가능하지만, 고려해야 할 차이점이 있을 수 있습니다.
> 
> [중요한 제한 사항](multiplatform-publish-lib-setup.md#host-requirements) 중 하나는 Apple 타겟은 반드시 macOS 환경에서 빌드되어야 한다는 점입니다.
> 
{style="note"}

## 샘플 라이브러리

이 튜토리얼에서는 [fibonacci](https://github.com/Kotlin/multiplatform-library-template/) 라이브러리를 예제로 사용합니다. 해당 저장소의 코드를 참조하여 배포 설정이 어떻게 작동하는지 확인할 수 있습니다.

코드를 재사용하려는 경우, **모든 예시 값을 자신의 프로젝트에 맞는 값으로 교체**해야 합니다.

## 계정 및 자격 증명 준비

Maven Central 배포를 시작하려면 [Maven Central](https://central.sonatype.com/) 포털에 로그인(또는 새 계정 생성)하세요.

### 네임스페이스 선택 및 확인

Maven Central에서 라이브러리 아티팩트를 고유하게 식별하려면 확인된 네임스페이스(namespace)가 필요합니다.

Maven 아티팩트는 [좌표(coordinates)](https://central.sonatype.org/publish/requirements/#correct-coordinates)로 식별됩니다(예: `com.example:fibonacci-library:1.0.0`). 이 좌표는 콜론으로 구분된 세 부분으로 구성됩니다:

* `groupId`: 역 DNS(reverse-DNS) 형식 (예: `com.example`)
* `artifactId`: 라이브러리 자체의 고유 이름 (예: `fibonacci-library`)
* `version`: 버전 문자열 (예: `1.0.0`). 버전은 어떤 문자열이든 가능하지만 `-SNAPSHOT`으로 끝날 수는 없습니다.

등록된 네임스페이스를 사용하면 Maven Central에서 `groupId` 형식을 설정할 수 있습니다. 예를 들어, `com.example` 네임스페이스를 등록하면 `groupId`가 `com.example`, `com.example.libraryname`, `com.example.module.feature` 등으로 설정된 아티팩트를 배포할 수 있습니다.

Maven Central에 로그인한 후 [Namespaces](https://central.sonatype.com/publishing/namespaces) 페이지로 이동하세요. 그다음 **Add Namespace** 버튼을 클릭하고 네임스페이스를 등록합니다:

<Tabs>
<TabItem id="github" title="GitHub 저장소 사용 시">

도메인 이름을 소유하고 있지 않다면 GitHub 계정을 사용하여 네임스페이스를 생성하는 것이 좋은 옵션입니다:

1. 네임스페이스로 `io.github.<your username>`을 입력하세요(예: `io.github.kotlinhandson`). 그다음 **Submit**을 클릭합니다.
2. 새로 생성된 네임스페이스 아래에 표시되는 **Verification Key**를 복사합니다.
3. GitHub에서 사용한 사용자 이름으로 로그인하고, 복사한 확인 키(verification key)를 이름으로 하는 새 공개 저장소(public repository)를 생성합니다(예: `http://github.com/kotlin-hands-on/ex4mpl3c0d`).
4. Maven Central로 돌아가 **Verify Namespace** 버튼을 클릭합니다. 확인에 성공하면 생성했던 저장소를 삭제해도 됩니다.

</TabItem>
<TabItem id="domain" title="도메인 이름 사용 시">

소유한 도메인 이름을 네임스페이스로 사용하려면:

1. 역 DNS 형식을 사용하여 도메인을 네임스페이스로 입력합니다. 도메인이 `example.com`이라면 `com.example`을 입력하세요.
2. 표시된 **Verification Key**를 복사합니다.
3. 확인 키를 내용으로 하는 새로운 TXT DNS 레코드를 생성합니다.

   다양한 도메인 등록 대행업체를 통해 이를 수행하는 방법에 대한 자세한 내용은 [Maven Central의 FAQ](https://central.sonatype.org/faq/how-to-set-txt-record/)를 참조하세요.
4. Maven Central로 돌아가 **Verify Namespace** 버튼을 클릭합니다. 확인에 성공하면 생성했던 TXT 레코드를 삭제해도 됩니다.

</TabItem>
</Tabs>

#### 키 쌍 생성

Maven Central에 무언가를 배포하기 전에 [PGP 서명(PGP signature)](https://central.sonatype.org/publish/requirements/gpg/)으로 아티팩트에 서명해야 합니다. 이는 사용자가 아티팩트의 출처를 검증할 수 있게 해줍니다.

서명을 시작하려면 키 쌍(key pair)을 생성해야 합니다:

* _개인 키(private key)_: 아티팩트에 서명하는 데 사용되며 타인과 공유해서는 안 됩니다.
* _공개 키(public key)_: 타인이 아티팩트의 서명을 검증할 수 있도록 공유할 수 있습니다.

<Tabs group ="key-pair-tools">
<TabItem title="Kotlin Gradle 플러그인 사용 시" group-key="kgp">

코틀린 Gradle 플러그인에는 키 쌍을 생성하는 데 사용할 수 있는 Gradle 태스크가 있습니다.

1. 다음 명령어를 사용하여 키 쌍을 생성합니다. 개인 키스토어(private keystore)의 비밀번호와 이름을 다음 형식으로 제공하세요:

    ```bash
    ./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
    ```

   키 쌍은 `build/pgp` 디렉토리에 저장됩니다.

2. 실수로 삭제되거나 무단 액세스되는 것을 방지하기 위해 키 쌍을 `build/pgp` 디렉토리에서 안전한 위치로 옮기세요.

</TabItem>
<TabItem title="gpg 도구 사용 시" group-key="gpg">

서명을 관리할 수 있는 `gpg` 도구는 [GnuPG 웹사이트](https://gnupg.org/download/index.html)에서 받을 수 있습니다. [Homebrew](https://brew.sh/)와 같은 패키지 관리자를 사용하여 설치할 수도 있습니다:

```bash 
brew install gpg
```

1. 다음 명령어를 사용하여 키 쌍 생성을 시작하고 안내에 따라 필요한 세부 정보를 제공합니다:

    ```bash
    gpg --full-generate-key
    ```

2. 생성할 키 유형으로 권장되는 기본값을 선택합니다. 선택 사항을 비워두고 <shortcut>Enter</shortcut>를 눌러 기본값을 수락할 수 있습니다.

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

   > 이 글을 쓰는 시점의 기본값은 `Curve 25519`가 적용된 `ECC (sign and encrypt)`입니다. 이전 버전의 `gpg`는 `3072` 비트 키 크기의 `RSA`가 기본값일 수 있습니다.
   >
   {style="note"}

3. 키의 유효 기간을 지정하라는 메시지가 표시되면 만료 날짜가 없는 기본 옵션을 선택할 수 있습니다.

   일정 시간 후 자동으로 만료되는 키를 생성하기로 선택한 경우, 만료 시 [유효 기간을 연장](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)해야 합니다.

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

4. 키와 ID를 연결하기 위해 이름, 이메일 및 선택 사항인 설명을 입력합니다(설명 필드는 비워둘 수 있습니다):

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5. 키를 암호화할 암호문(passphrase)을 입력하고 확인을 위해 다시 입력합니다.

   이 암호문을 안전하고 비공개로 보관하세요. 나중에 아티팩트에 서명할 때 개인 키에 액세스하기 위해 필요합니다.

6. 다음 명령어로 생성한 키를 확인합니다:

   ```bash
   gpg --list-keys
   ```

   출력 결과는 다음과 비슷합니다:

    ```text
    pub   ed25519 2024-10-06 [SC]
          F175482952A225BFD4A07A713EE6B5F76620B385CE
    uid   [ultimate] Jane Doe <janedoe@example.com>
          sub   cv25519 2024-10-06 [E]
    ```

    다음 단계에서 출력된 키의 긴 영숫자 식별자를 사용해야 합니다.

</TabItem>
</Tabs>

#### 공개 키 업로드

Maven Central에서 키가 수락되려면 [공개 키를 키 서버에 업로드](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)해야 합니다. 여러 키 서버가 있지만 기본 선택지로 `keyserver.ubuntu.com`을 사용하겠습니다.

<Tabs group ="key-pair-tools">
<TabItem title="Kotlin Gradle 플러그인 사용 시" group-key="kgp">

코틀린 Gradle 플러그인에는 공개 키를 업로드하는 데 사용할 수 있는 Gradle 태스크가 있습니다.

다음 명령어를 실행하여 공개 키의 경로를 제공하고 업로드합니다:

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

</TabItem>
<TabItem title="gpg 도구 사용 시" group-key="gpg">

Maven Central에서 키가 수락되려면 [공개 키를 키 서버에 업로드](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)해야 합니다. 여러 키 서버가 있지만 기본 선택지로 `keyserver.ubuntu.com`을 사용하겠습니다.

매개변수에 **자신의 키 ID를 대신 입력**하여 `gpg`로 공개 키를 업로드하는 다음 명령어를 실행합니다:

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

**개인 키 내보내기** {id="export-your-private-key"}

Gradle 프로젝트가 개인 키에 액세스할 수 있도록 파일로 내보내야 합니다. 키를 생성할 때 사용한 암호문을 입력하라는 메시지가 표시됩니다.

매개변수로 **자신의 키 ID를 전달**하여 다음 명령어를 사용하세요:

```bash
gpg --armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

이 명령어는 개인 키를 포함하는 `key.gpg` 텍스트 파일을 생성합니다.

> 개인 키 파일은 절대 타인과 공유하지 마세요. 개인 키를 통해 자격 증명으로 파일에 서명할 수 있으므로 본인만 접근할 수 있어야 합니다.
>
{style="warning"}

</TabItem>
</Tabs>

## 프로젝트 구성

### 라이브러리 프로젝트 준비

템플릿 프로젝트에서 라이브러리 개발을 시작했다면, 지금이 프로젝트의 기본 이름들을 자신의 라이브러리 이름에 맞게 변경하기 좋은 시점입니다. 여기에는 라이브러리 모듈 이름과 최상위 `build.gradle.kts` 파일의 루트 프로젝트 이름이 포함됩니다.

프로젝트에 Android 타겟이 있는 경우, [Android 라이브러리 릴리스 준비 단계](https://developer.android.com/build/publish-library/prep-lib-release)를 따라야 합니다. 최소한 이 과정에서는 리소스 컴파일 시 고유한 `R` 클래스가 생성되도록 라이브러리에 [적절한 네임스페이스를 지정](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)해야 합니다. 이 네임스페이스는 [앞서 생성한](#choose-and-verify-a-namespace) Maven 네임스페이스와는 다릅니다.

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 배포 플러그인 설정

이 튜토리얼에서는 Maven Central 배포를 돕기 위해 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin)을 사용합니다. 플러그인의 장점에 대해서는 [여기](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)에서 자세히 읽어볼 수 있습니다. 사용법 및 사용 가능한 구성 옵션에 대해 자세히 알아보려면 [플러그인 문서](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)를 참조하세요.

프로젝트에 플러그인을 추가하려면 라이브러리 모듈의 `build.gradle.kts` 파일에 있는 `plugins {}` 블록에 다음 라인을 추가하세요:

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%" 
}
```

> 플러그인의 최신 버전은 [릴리스 페이지](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)에서 확인하세요.
> 
{style="note"}

같은 파일에 다음 구성을 추가하되, 모든 값을 자신의 라이브러리에 맞게 수정해야 합니다:

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

> 이를 구성하기 위해 [Gradle 속성(properties)](https://docs.gradle.org/current/userguide/build_environment.html)을 사용할 수도 있습니다.
> 
{style="tip"}

여기서 가장 중요한 설정은 다음과 같습니다:

* `coordinates`: 라이브러리의 `groupId`, `artifactId`, `version`을 지정합니다.
* [라이선스(license)](https://central.sonatype.org/publish/requirements/#license-information): 라이브러리가 배포되는 조건입니다.
* [개발자 정보(developer information)](https://central.sonatype.org/publish/requirements/#developer-information): 라이브러리 저자 목록입니다.
* [SCM (Source Code Management) 정보](https://central.sonatype.org/publish/requirements/#scm-information): 라이브러리 소스 코드가 호스팅되는 위치를 지정합니다.

### 로컬 체크 실행

Maven Central에 배포하기 전에 프로젝트가 올바르게 구성되었는지 로컬에서 확인하는 것이 좋습니다.

#### 로컬 서명 확인

다음 명령어를 실행하여 서명을 위한 키가 올바르게 구성되었는지 확인합니다:

```bash
./gradlew checkSigningConfiguration
```

이 Gradle 태스크는 공개 키가 `keyserver.ubuntu.com` 또는 `keys.openpgp.org` 키 서버에 업로드되었는지 확인합니다.

태스크에서 오류가 보고되면 출력된 상세 내용을 검토하여 수정하세요.

#### 로컬 `pom.xml` 파일 확인

라이브러리를 Maven Central에 배포하려면 `pom.xml` 파일이 Maven Central의 [요구 사항](https://central.sonatype.org/publish/requirements/#required-pom-metadata)을 충족해야 합니다.

배포하려는 각 라이브러리에 대해 `<PUBLICATION_NAME>`을 배포 이름으로 바꿔 다음 명령어를 실행합니다:

```bash
./gradlew checkPomFileFor<PUBLICATION_NAME>Publication
```

[vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin)을 사용하면 배포 이름은 일반적으로 `Maven`입니다. 이 경우 태스크는 다음과 같습니다:

```bash
./gradlew checkPomFileForMavenPublication
```

태스크에서 오류가 보고되면 출력된 상세 내용을 검토하여 수정하세요.

## 지속적 통합을 사용하여 Maven Central에 배포

### 사용자 토큰 생성

Maven Central에서 배포 요청을 승인하려면 Maven 액세스 토큰이 필요합니다.
[Setup Token-Based Authentication](https://central.sonatype.com/usertoken) 페이지를 열고 **Generate User Token** 버튼을 클릭하세요.

출력 결과는 아래 예시와 같이 사용자 이름(username)과 비밀번호(password)를 포함합니다. 이 자격 증명은 Maven Central에 저장되지 않으므로 분실하면 나중에 새로 생성해야 합니다.

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### GitHub에 시크릿 추가

배포에 필요한 키와 자격 증명을 비공개로 유지하면서 GitHub Action 워크플로에서 사용하려면 이 값들을 시크릿(secrets)으로 저장해야 합니다.

1. GitHub 저장소의 **Settings** 페이지에서 **Security** | **Secrets and variables** | **Actions**를 클릭합니다.
2. `New repository secret` 버튼을 클릭하고 다음 시크릿들을 추가합니다:

   * `MAVEN_CENTRAL_USERNAME` 및 `MAVEN_CENTRAL_PASSWORD`: Central Portal 웹사이트에서 [생성한 사용자 토큰](#generate-the-user-token) 값입니다.
   * `SIGNING_KEY_ID`: 서명 키 식별자의 **마지막 8자리**입니다. 예를 들어 `F175482952A225BFC4A07A715EE6B5F76620B385CE`라면 `20B385CE`입니다.
   * `SIGNING_PASSWORD`: GPG 키를 생성할 때 입력한 암호문입니다.
   * `GPG_KEY_CONTENTS`: [자신의 `key.gpg` 파일](#export-your-private-key) 전체 내용입니다.

   ![GitHub에 시크릿 추가](github_secrets.png){width=700}

다음 단계의 CI 구성에서 이 시크릿 이름들을 사용하게 됩니다.

### 프로젝트에 GitHub Actions 워크플로 추가

라이브러리를 자동으로 빌드하고 배포하도록 지속적 통합을 설정할 수 있습니다. 여기서는 [GitHub Actions](https://docs.github.com/en/actions)를 예로 사용합니다.

시작하려면 저장소의 `.github/workflows/publish.yml` 파일에 다음 워크플로를 추가하세요:

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

이 파일을 커밋하고 푸시하면 프로젝트를 호스팅하는 GitHub 저장소에서 릴리스(사전 릴리스 포함)를 생성할 때마다 워크플로가 자동으로 실행됩니다. 워크플로는 현재 버전의 코드를 체크아웃하고, JDK를 설정한 다음, `publishToMavenCentral` Gradle 태스크를 실행합니다.

`publishToMavenCentral` 태스크를 사용할 때는 배포 상태를 직접 확인하고 Maven Central 웹사이트에서 [수동으로 배포를 릴리스](#create-a-release-on-github)해야 합니다. 또는 `publishAndReleaseToMavenCentral` 태스크를 사용하여 릴리스 프로세스 전체를 완전히 자동화할 수도 있습니다.

저장소에 [태그가 푸시될 때 트리거](https://stackoverflow.com/a/61892639)되도록 워크플로를 구성할 수도 있습니다.

> 위 스크립트에서는 배포 플러그인이 Gradle [구성 캐시(configuration cache)](https://docs.gradle.org/current/userguide/configuration_cache.html)를 지원하지 않으므로(이 [미해결 이슈](https://github.com/gradle/gradle/issues/22779) 참조), Gradle 명령어에 `--no-configuration-cache`를 추가하여 이를 비활성화했습니다.
>
{style="tip"}

이 액션에는 [저장소 시크릿](#add-secrets-to-github)으로 생성한 서명 세부 정보와 Maven Central 자격 증명이 필요합니다.

워크플로 구성은 이러한 시크릿을 환경 변수로 자동 전환하여 Gradle 빌드 프로세스에서 사용할 수 있도록 합니다.

### GitHub에서 릴리스 생성

워크플로와 시크릿 설정이 완료되면 이제 라이브러리 배포를 트리거할 [릴리스 생성(create a release)](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)을 할 준비가 되었습니다.

1. 라이브러리의 `build.gradle.kts` 파일에 지정된 버전 번호가 배포하려는 버전인지 확인합니다.
2. GitHub 저장소의 메인 페이지로 이동합니다.
3. 오른쪽 사이드바에서 **Releases**를 클릭합니다.
4. **Draft a new release** 버튼을 클릭합니다(이 저장소에서 이전에 릴리스를 만든 적이 없다면 **Create a new release** 버튼).
5. 각 릴리스에는 태그가 있습니다. 태그 드롭다운에서 새 태그를 생성하고 릴리스 제목을 설정합니다(태그 이름과 제목은 동일하게 설정할 수 있습니다).
   
   일반적으로 `build.gradle.kts` 파일에 지정한 라이브러리의 버전 번호와 동일하게 설정하는 것이 좋습니다.

   ![GitHub에서 릴리스 생성](create_release_and_tag.png){width=700}

6. 릴리스 대상으로 지정하려는 브랜치를 다시 한번 확인하고(기본 브랜치가 아닌 경우 특히 주의), 새 버전에 대한 적절한 릴리스 노트를 추가합니다.
7. 설명 아래의 체크박스를 사용하여 릴리스를 사전 릴리스(pre-release)로 표시할 수 있습니다(알파, 베타, RC 등 초기 액세스 버전에 유용).
   
   이전에 릴리스를 만든 적이 있다면 이 릴리스를 최신(latest) 버전으로 표시할 수도 있습니다.
8. **Publish release** 버튼을 클릭하여 새 릴리스를 생성합니다.
9. GitHub 저장소 페이지 상단의 **Actions** 탭을 클릭합니다. 새 릴리스가 배포 워크플로를 트리거한 것을 확인할 수 있습니다.
    
   워크플로를 클릭하여 배포 태스크의 출력을 볼 수 있습니다.
10. 워크플로 실행이 완료되면 Maven Central의 [Deployments](https://central.sonatype.com/publishing/deployments) 대시보드로 이동합니다. 여기에 새로운 배포 건이 표시될 것입니다.

    이 배포는 Maven Central에서 검사를 수행하는 동안 한동안 _pending_ 또는 _validating_ 상태로 유지될 수 있습니다.

11. 배포가 _validated_ 상태가 되면 업로드한 모든 아티팩트가 포함되어 있는지 확인합니다. 모든 것이 올바르다면 **Publish** 버튼을 클릭하여 이 아티팩트들을 릴리스합니다.

    ![배포 설정](published_on_maven_central.png){width=700}

    > 릴리스 후 아티팩트가 Maven Central 저장소에 공개적으로 사용 가능해지기까지는 약간의 시간(보통 15~30분 정도 소요되지만 몇 시간이 걸릴 수도 있음)이 걸립니다. 인덱싱되어 [Maven Central 웹사이트](https://central.sonatype.com/)에서 검색 가능해지기까지는 더 오랜 시간이 걸릴 수 있습니다.
    >
    {style="tip"}

배포가 검증된 후 자동으로 아티팩트를 릴리스하려면 워크플로의 `publishToMavenCentral` 태스크를 `publishAndReleaseToMavenCentral`로 바꾸세요.

## 다음 단계

* [멀티플랫폼 라이브러리 배포 설정 및 요구 사항에 대해 더 알아보기](multiplatform-publish-lib-setup.md)
* [README에 shields.io 배지 추가하기](https://shields.io/badges/maven-central-version)
* [Dokka를 사용하여 프로젝트의 API 문서 공유하기](https://kotl.in/dokka)
* [의존성을 자동으로 업데이트하도록 Renovate 추가하기](https://docs.renovatebot.com/)
* [JetBrains의 검색 플랫폼에서 라이브러리 홍보하기](https://klibs.io/)
* [Kotlin Slack의 `#feed` 채널에서 커뮤니티와 라이브러리 공유하기](https://kotlinlang.slack.com/)
  (가입하려면 https://kotl.in/slack 방문)