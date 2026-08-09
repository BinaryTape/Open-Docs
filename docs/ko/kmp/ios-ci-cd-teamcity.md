[//]: # (title: Kotlin Multiplatform 프로젝트를 위한 iOS 배포 파이프라인 구성하기)

이 튜토리얼에서는 iOS 타겟이 포함된 Kotlin Multiplatform 프로젝트를 위해 TeamCity Cloud를 설정하는 방법을 배웁니다.
호스팅된 macOS 에이전트에서 iOS 앱을 빌드 및 테스트하는 CI 파이프라인을 생성하고, Apple 서명 자격 증명(signing credentials)을 구성하고, TestFlight에 빌드를 업로드하며, GitHub 저장소에 푸시할 때마다 새로운 빌드가 시작되도록 프로세스를 자동화하는 과정을 살펴봅니다.

[Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)은 프로젝트를 TeamCity Cloud에 연결하는 것부터 iOS 애플리케이션을 게시하는 것까지, IDE 내에서 직접 전체 설정 과정을 안내합니다.

이 워크플로를 통해 TeamCity Cloud는 다음과 같은 기능을 제공합니다:

* 호스팅된 macOS 에이전트를 제공하므로, 직접 Mac을 준비할 필요가 없습니다.
* 필요한 파이프라인 구성을 자동으로 생성합니다.
* 빌드에 서명하고 [TestFlight](https://developer.apple.com/testflight/)에 게시합니다.
* 월별 빌드 시간 및 저장소 용량이 제공되는 무료 시작 티어를 제공합니다.

## TeamCity 파이프라인 생성하기

### IDE에서 CI 설정 시작하기

1. 프로젝트 변경 사항을 커밋하고 푸시하세요. CI가 아직 구성되지 않은 경우, Kotlin Multiplatform IDE 플러그인에 CI 설정을 시작하라는 툴팁이 표시됩니다.
2. **Configure CI**를 클릭합니다.
   ![변경 사항 푸시 후 Configure CI 툴팁이 나타남](ios-pipeline-Configure-CI.png){width=450 style="block"}
   플러그인이 호스팅된 macOS 에이전트에서 iOS 앱을 빌드하고 테스트하는 데 필요한 파일을 생성합니다. 이 파일들은 로컬 프로젝트에 추가되지만 아직 커밋되지는 않은 상태입니다.
3. TeamCity 플러그인이 설치되어 있지 않으면 IDE에서 설치를 제안합니다. **Install TeamCity plugin**을 클릭한 후 설정 과정으로 돌아오세요.
   ![CI/CD 설정을 위한 플러그인 설치](ios-pipeline-install-plugin.png){width=700 style="block"}

    > JetBrains Marketplace에서 직접 [TeamCity](https://plugins.jetbrains.com/plugin/25142) 플러그인을 설치할 수도 있습니다.
    >
    {style="note"}

4. IDE에 **Pipeline is ready**가 표시되면 초기 파이프라인 구성이 완료된 것입니다. **Continue**를 클릭하고, 안내에 따라 IDE가 생성된 파일을 Git에 추가하도록 허용하세요. 이 파일들은 저장소에 커밋하기 전까지 로컬에 유지됩니다.

### TeamCity Cloud 워크스페이스 생성 또는 연결하기

TeamCity가 호스팅된 macOS 에이전트에서 빌드를 실행하려면 Cloud 워크스페이스가 필요합니다.

1. TeamCity Cloud 서비스 약관을 검토하고 수락합니다.
2. **Create free account**를 클릭하여 TeamCity Cloud 계정을 생성합니다.

    > TeamCity Cloud는 JetBrains에서 호스팅하며 무료 시작 티어를 제공합니다.
    > 무료 티어에는 월별 빌드 시간과 저장소 용량이 포함되어 있어, 비용 부담 없이 이 파이프라인을 시작하고 테스트하기에 충분합니다.
    > CI/CD 요구 사항이 늘어나면 언제든지 요금제를 업그레이드할 수 있습니다.
    >
    {style="note"}

3. 브라우저에서 **Authorize JetBrains**를 클릭하여 연동을 승인합니다.

TeamCity가 워크스페이스를 생성하거나 연결하고 빌드 환경을 준비합니다. 이 과정은 대개 30초 이내에 완료됩니다.

## iOS 앱 빌드하기

워크스페이스가 준비되면 IDE가 자동으로 **TeamCity** 탭을 열고 첫 빌드를 시작합니다.

이 첫 번째 실행에서 TeamCity는 아직 커밋되지 않은 로컬 프로젝트 파일을 사용합니다. 호스팅된 macOS 에이전트에서 iOS 애플리케이션을 빌드하고 구성된 테스트를 실행합니다. 이를 통해 생성된 파일을 저장소에 커밋하기 전에 파이프라인이 예상대로 작동하는지 확인할 수 있습니다.

![iOS 빌드 성공](ios-pipeline-first-build.png){width=700 style="block"}

자동화된 빌드가 성공하면 **Publish to TestFlight**를 클릭하여 서명 및 배포를 구성합니다.

## Apple 서명 및 TestFlight 구성하기

TestFlight에 빌드를 업로드하려면 TeamCity에 App Store Connect 및 Apple 코드 서명(code signing)을 위한 자격 증명이 필요합니다.

### App Store Connect API 키 생성하기

1. [App Store Connect](https://appstoreconnect.apple.com/)에 로그인합니다.
2. **사용자 및 액세스(Users and Access)**로 이동하여 **키(Keys)**를 선택합니다.
3. 앱 업로드에 필요한 권한을 가진 API 키를 생성합니다.
4. 개인 키(`.p8` 파일)를 다운로드합니다.
5. 키에 표시된 **발급자 ID(Issuer ID)**와 **키 ID(Key ID)**를 기록해 둡니다.

`.p8` 파일은 한 번만 다운로드할 수 있으므로 안전하게 보관하세요.

### Apple 배포 인증서 내보내기

1. Xcode의 **Settings** | **Accounts**로 이동하거나 [Apple Developer Portal](https://developer.apple.com/account/)을 열어 Apple 배포(Distribution) 인증서를 생성하거나 찾습니다.
2. Mac에서 **키체인 접근(Keychain Access)**을 열고 **내 인증서** 탭에서 해당 인증서를 찾습니다.
3. 인증서를 우클릭하고 **내보내기(Export)**를 선택하여 `.p12` 파일로 저장합니다.
4. 내보내기 비밀번호를 설정하고 안전하게 보관하세요. 나중에 필요합니다.

> Mac을 사용할 수 없는 경우, Windows나 Linux에서 OpenSSL을 사용하여 인증서 서명 요청(CSR)을 [생성](https://www.ssl.com/how-to/manually-generate-a-certificate-signing-request-csr-using-openssl/)하고 결과 인증서를 `.p12` 파일로 [변환](https://www.ssl.com/how-to/create-a-pfx-p12-certificate-file-using-openssl/)할 수 있습니다.
>
{style="note"}

### IDE에서 Apple 자격 증명 추가하기

IDE로 돌아와 **Add Apple signing credentials** 양식을 작성합니다. TeamCity는 이 값들을 안전한 배포 자격 증명으로 저장하며, 프로젝트 소스 파일에는 추가되지 않습니다.

|-------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Issuer ID**     | App Store Connect API 연동을 식별하는 발급자 ID입니다.                                                                               |
| **Key ID**        | 생성한 API 키를 식별하는 키 ID입니다.                                                                                         |
| **Private Key**   | App Store Connect에서 다운로드한 `.p8` 파일입니다.                                                                                |
| **Team ID**       | Apple Developer 팀 식별자입니다.                                                                                            |
| **Bundle ID**     | 앱 타겟에 구성되어 있고 App Store Connect에 등록된 앱의 고유 식별자(예: `com.company.app`)입니다. |
| **Certificate**   | 개인 키를 포함하는 `.p12` 배포 인증서입니다.                                                                                              |
| **.p12 password** | 인증서를 내보낼 때 지정한 비밀번호입니다.                                                                                                 |
{style="none"}

### 첫 빌드를 TestFlight에 업로드하기

자격 증명을 추가하면 파이프라인에 서명 및 배포 단계가 포함됩니다.

1. **Deploy to TestFlight**를 클릭합니다.
    TeamCity가 파이프라인을 다시 실행하고, 서명된 iOS 빌드를 생성하여 App Store Connect에 업로드합니다.
2. App Store Connect 또는 TestFlight를 열어 빌드가 나타나는지 확인합니다.

## 빌드 및 게시 자동화하기

### 저장소 연결하기

이 프로세스를 자동화하려면 GitHub 저장소를 TeamCity에 연결하여 푸시할 때마다 새로운 빌드가 트리거되도록 설정해야 합니다.

1. 첫 번째 배포 파이프라인이 성공적으로 끝나면 IDE에서 **Connect repository**를 클릭합니다. 브라우저에서 TeamCity가 열리고 저장소 권한이 승인되었음을 확인합니다. TeamCity가 저장소와 브랜치를 자동으로 감지하여 파이프라인에 연결합니다.
2. IDE로 돌아와 생성된 파이프라인 구성 파일을 커밋하고 푸시합니다.

이제 구성된 브랜치에 변경 사항을 푸시할 때마다 TeamCity가 파이프라인을 트리거합니다.

### 파이프라인 확인하기

이제 iOS 배포 파이프라인이 준비되었습니다! 설정된 브랜치에 푸시할 때마다 TeamCity는 다음 과정을 수행합니다:

1. 호스팅된 macOS 에이전트에서 빌드를 시작합니다.
2. Kotlin Multiplatform 프로젝트를 빌드합니다.
3. 구성된 테스트를 실행합니다.
4. iOS 애플리케이션에 서명합니다.
5. 새로운 빌드를 TestFlight에 업로드합니다.

![iOS 배포 파이프라인 준비 완료](ios-pipeline-success.png){width=700 style="block"}

**Done**을 클릭하여 설정 흐름을 종료합니다.

이제부터 코드를 푸시하기만 하면 나머지는 TeamCity가 알아서 처리합니다.

## 다음 단계

* 설정을 더 자세히 커스터마이징하려면 [TeamCity Cloud 파이프라인](https://www.jetbrains.com/help/teamcity/cloud/create-and-edit-pipelines.html)에 대해 읽어보세요. 더 많은 프로젝트를 생성하고 빌드 에이전트 요구 사항을 설정하는 등의 작업을 할 수 있습니다.
* [멀티플랫폼 앱을 게시하는 방법](multiplatform-publish-apps.md)을 알아보세요.
* Kotlin Multiplatform 애플리케이션의 지속적 통합을 위해 [GitHub Actions 구성하기](github-actions-for-kmp.md)를 확인해 보세요.