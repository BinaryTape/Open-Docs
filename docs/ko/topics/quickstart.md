[//]: # (title: Kotlin Multiplatform 퀵스타트)

<web-summary>JetBrains는 IntelliJ IDEA와 Android Studio에 공식 Kotlin IDE 지원을 제공합니다.</web-summary>

이 튜토리얼을 통해 간단한 Kotlin Multiplatform 앱을 시작하고 실행할 수 있습니다.

## 환경 설정

Kotlin Multiplatform (KMP) 프로젝트에는 특정 환경이 필요하지만, 대부분의 요구 사항은 IDE의 사전 점검(preflight check)을 통해 명확해집니다.

IDE 및 필요한 플러그인부터 시작합니다:

1.  IDE 선택 및 설치
    Kotlin Multiplatform는 IntelliJ IDEA와 Android Studio에서 지원되므로, 선호하는 IDE를 사용할 수 있습니다.

    [JetBrains Toolbox App](https://www.jetbrains.com/toolbox/app/)은 IDE 설치에 권장되는 도구입니다.
    이 도구를 사용하면 [Early Access Program](https://www.jetbrains.com/resources/eap/) (EAP) 및 Nightly 릴리스를 포함한 여러 제품 또는 버전을 관리할 수 있습니다.

    단독 설치의 경우, [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 또는 [Android Studio](https://developer.android.com/studio)용 설치 프로그램을 다운로드하십시오.

    Kotlin Multiplatform에 필요한 플러그인은 **IntelliJ IDEA 2025.1.1.1** 또는 **Android Studio Narwhal 2025.1.1**이 필요합니다.

2.  [Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)을 설치합니다 (Kotlin Multiplatform Gradle 플러그인과 혼동하지 마십시오).

    > Kotlin Multiplatform 플러그인은 아직 Windows 또는 Linux의 IDE에서는 사용할 수 없습니다.
    > 하지만 이들 플랫폼에서 이 플러그인이 반드시 필요한 것은 아닙니다. 여전히 이 튜토리얼을 따라 KMP 프로젝트를 생성하고 실행할 수 있습니다.
    >
    {style="note"}

3.  IntelliJ IDEA용 Kotlin Multiplatform IDE 플러그인을 설치하면 아직 설치되지 않은 모든 필수 종속성도 설치됩니다 (Android Studio는 필요한 모든 플러그인이 번들로 제공됩니다).

    Windows 또는 Linux용 IntelliJ IDEA를 사용하는 경우, 다음 필수 플러그인을 수동으로 설치해야 합니다:
    *   [Android](https://plugins.jetbrains.com/plugin/22989-android)
    *   [Android Design Tools](https://plugins.jetbrains.com/plugin/22990-android-design-tools)
    *   [Jetpack Compose](https://plugins.jetbrains.com/plugin/18409-jetpack-compose)
    *   [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)
    *   [Compose Multiplatform for Desktop IDE Support](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-for-desktop-ide-support)
        (Kotlin Multiplatform 플러그인이 없는 경우에만 필요합니다).

4.  `ANDROID_HOME` 환경 변수가 설정되어 있지 않다면, 시스템이 이를 인식하도록 설정하십시오:

    <tabs>
    <tab title= "Bash 또는 Zsh">

    다음 명령어를 `.profile` 또는 `.zprofile`에 추가합니다:

    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```

    </tab>
    <tab title= "Windows PowerShell 또는 CMD">

    PowerShell의 경우, 다음 명령어를 사용하여 영구 환경 변수를 추가할 수 있습니다 (자세한 내용은 [PowerShell 문서](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)를 참조하십시오):

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    CMD의 경우, [`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) 명령어를 사용하십시오:

    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </tab>
    </tabs>

5.  iOS 애플리케이션을 생성하려면 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)가 설치된 macOS 호스트가 필요합니다.
    IDE는 내부적으로 Xcode를 실행하여 iOS 프레임워크를 빌드합니다.

    KMP 프로젝트 작업을 시작하기 전에 Xcode를 최소 한 번 실행하여 초기 설정을 완료했는지 확인하십시오.

    > Xcode가 업데이트될 때마다 수동으로 실행하고 업데이트된 도구를 다운로드해야 합니다.
    > Kotlin Multiplatform IDE 플러그인은 Xcode가 작업하기에 올바른 상태가 아닐 때마다 알림을 제공하는 사전 점검을 수행합니다.
    >
    {style="note"}

## 프로젝트 생성

### macOS에서

macOS에서는 Kotlin Multiplatform 플러그인이 IDE 내에서 프로젝트 생성 마법사를 제공합니다:

<tabs>
<tab title= "IntelliJ IDEA">

IDE 마법사를 사용하여 새 KMP 프로젝트를 생성합니다:

1.  주 메뉴에서 **File** | **New** | **Project**를 선택합니다.
2.  왼쪽 목록에서 **Kotlin Multiplatform**를 선택합니다.
3.  필요에 따라 프로젝트의 이름, 위치 및 기타 기본 속성을 설정합니다.
4.  프로젝트의 JDK로 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 버전을 선택하는 것을 권장합니다. 이는 특히 데스크톱 KMP 앱의 호환성을 개선하는 데 중요한 수정 사항을 제공하기 때문입니다. 관련 JBR 버전은 모든 IntelliJ IDEA 배포판에 포함되어 있으므로 추가 설정이 필요하지 않습니다.
5.  프로젝트에 포함하고자 하는 플랫폼을 선택합니다:
    *   모든 대상 플랫폼은 처음부터 Compose Multiplatform를 사용하여 UI 코드를 공유하도록 설정할 수 있습니다 (UI 코드가 없는 서버 모듈 제외).
    *   iOS의 경우, 다음 두 가지 구현 중 하나를 선택할 수 있습니다:
        *   Compose Multiplatform를 사용한 공유 UI 코드
        *   SwiftUI로 만들어지고 공유 로직을 가진 Kotlin 모듈에 연결된 완전 네이티브 UI
    *   데스크톱 대상에는 [](compose-hot-reload.md) 기능의 알파 버전이 포함되어 있어 해당 코드를 변경하는 즉시 UI 변경 사항을 확인할 수 있습니다. 데스크톱 앱을 만들 계획이 없더라도, UI 코드 작성을 가속화하기 위해 데스크톱 버전을 사용하고 싶을 수 있습니다.

플랫폼 선택을 마쳤다면 **Create** 버튼을 클릭하고 IDE가 프로젝트를 생성하고 가져올 때까지 기다립니다.

![IntelliJ IDEA Wizard with default settings and Android, iOS, desktop, and web platforms selected](idea-wizard-1step.png){width=800}

</tab>
<tab title= "Android Studio">

Kotlin Multiplatform IDE 플러그인은 K2 기능에 크게 의존하며, K2 기능 없이는 설명된 대로 작동하지 않습니다. 따라서 시작하기 전에 K2 모드가 활성화되어 있는지 확인하십시오: **Settings** | **Languages & Frameworks** | **Kotlin** | **Enable K2 mode**.

IDE 마법사를 사용하여 새 KMP 프로젝트를 생성합니다:

1.  주 메뉴에서 **File** | **New** | **New project**를 선택합니다.
2.  기본 **Phone and Tablet** 템플릿 카테고리에서 **Kotlin Multiplatform**를 선택합니다.

    ![First new project step in Android Studio](as-wizard-1.png){width="400"}

3.  필요에 따라 프로젝트의 이름, 위치 및 기타 기본 속성을 설정한 다음 **Next**를 클릭합니다.
4.  프로젝트에 포함하고자 하는 플랫폼을 선택합니다:
    *   모든 대상 플랫폼은 처음부터 Compose Multiplatform를 사용하여 UI 코드를 공유하도록 설정할 수 있습니다 (UI 코드가 없는 서버 모듈 제외).
    *   iOS의 경우, 다음 두 가지 구현 중 하나를 선택할 수 있습니다:
        *   Compose Multiplatform를 사용한 공유 UI 코드
        *   SwiftUI로 만들어지고 공유 로직을 가진 Kotlin 모듈에 연결된 완전 네이티브 UI
    *   데스크톱 대상에는 핫 리로드(hot reload) 기능의 알파 버전이 포함되어 있어 해당 코드를 변경하는 즉시 UI 변경 사항을 확인할 수 있습니다. 데스크톱 앱을 만들 계획이 없더라도, UI 코드 작성을 가속화하기 위해 데스크톱 버전을 사용하고 싶을 수 있습니다.
5.  프로젝트가 생성되면, [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 버전을 프로젝트의 JDK로 선택하는 것을 권장합니다. 이는 특히 데스크톱 KMP 앱의 호환성을 개선하는 데 중요한 수정 사항을 제공하기 때문입니다. 관련 JBR 버전은 모든 IntelliJ IDEA 배포판에 포함되어 있으므로 추가 설정이 필요하지 않습니다.

플랫폼 선택을 마쳤다면 **Finish** 버튼을 클릭하고 IDE가 프로젝트를 생성하고 가져올 때까지 기다립니다.

![Last step in the Android Studio wizard with Android, iOS, desktop, and web platforms selected](as-wizard-3step.png){width=800}

</tab>
</tabs>

### Windows 또는 Linux에서

Windows 또는 Linux를 사용 중인 경우:

1.  [웹 KMP 마법사](https://kmp.jetbrains.com/)를 사용하여 프로젝트를 생성합니다.
2.  아카이브를 압축 해제하고 결과 폴더를 IDE에서 엽니다.
3.  가져오기가 완료될 때까지 기다린 다음, 앱을 빌드하고 실행하는 방법을 알아보려면 [](#run-the-sample-apps) 섹션으로 이동하십시오.

## 사전 점검 확인

**Project Environment Preflight Checks** 도구 창을 열어 프로젝트 설정에 환경 문제가 없는지 확인할 수 있습니다. 오른쪽 사이드바 또는 하단 바에 있는 사전 점검 아이콘 ![Preflight checks icon with a plane](ide-preflight-checks.png){width="20"}을 클릭하십시오.

이 도구 창에서 이러한 점검과 관련된 메시지를 확인하거나, 다시 실행하거나, 설정을 변경할 수 있습니다.

사전 점검 명령어는 **Search Everywhere** 대화 상자에서도 사용할 수 있습니다.
<shortcut>Shift</shortcut>를 두 번 누르고 "preflight"라는 단어를 포함하는 명령어를 검색하십시오:

![The Search Everywhere menu with the word "preflight" entered](double-shift-preflight-checks.png)

## 샘플 앱 실행

IDE 마법사가 생성한 프로젝트에는 iOS, Android, 데스크톱 및 웹 애플리케이션용으로 생성된 실행 구성과 서버 앱 실행을 위한 Gradle 작업이 포함되어 있습니다. Windows 및 Linux에서는 각 플랫폼에 대한 Gradle 명령을 아래에서 확인하십시오.

<tabs>
<tab title="Android">

Android 앱을 실행하려면 **composeApp** 실행 구성을 시작합니다:

![Dropdown with the Android run configuration highlighted](run-android-configuration.png){width=250}

Windows 또는 Linux에서 Android 앱을 실행하려면 **Android App** 실행 구성을 생성하고 모듈 **[project name].composeApp**을 선택하십시오.

기본적으로 사용 가능한 첫 번째 가상 장치에서 실행됩니다:

![Android app ran on a virtual device](run-android-app.png){width=350}

</tab>
<tab title="iOS">

> iOS 앱을 빌드하려면 macOS 호스트가 필요합니다.
>
{style="note"}

프로젝트의 iOS 대상을 선택하고 Xcode가 설치된 macOS 머신을 설정했다면, **iosApp** 실행 구성을 선택하고 시뮬레이션된 장치를 선택할 수 있습니다:

![Dropdown with the iOS run configuration highlighted](run-ios-configuration.png){width=250}

iOS 앱을 실행하면 내부적으로 Xcode로 빌드되어 iOS 시뮬레이터에서 실행됩니다. 첫 번째 빌드는 컴파일을 위한 네이티브 종속성을 수집하고 이후 실행을 위해 빌드를 준비합니다:

![iOS app ran on a virtual device](run-ios-app.png){width=350}

</tab>
<tab title="Desktop">

데스크톱 앱의 기본 실행 구성은 **composeApp [desktop]**으로 생성됩니다:

![Dropdown with the default desktop run configuration highlighted](run-desktop-configuration.png){width=250}

Windows 또는 Linux에서 데스크톱 앱을 실행하려면, **[app name]:composeApp** Gradle 프로젝트를 가리키는 **Gradle** 실행 구성을 다음 명령과 함께 생성하십시오:

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

이 구성을 통해 JVM 데스크톱 앱을 실행할 수 있습니다:

![JVM app ran on a virtual device](run-desktop-app.png){width=600}

</tab>
<tab title="Web">

웹 앱의 기본 실행 구성은 **composeApp [wasmJs]**로 생성됩니다:

![Dropdown with the default Wasm run configuration highlighted](run-wasm-configuration.png){width=250}

Windows 또는 Linux에서 웹 앱을 실행하려면, **[app name]:composeApp** Gradle 프로젝트를 가리키는 **Gradle** 실행 구성을 다음 명령과 함께 생성하십시오:

```shell
wasmJsBrowserDevelopmentRun
```

이 구성을 실행하면 IDE는 Kotlin/Wasm 앱을 빌드하고 기본 브라우저에서 엽니다:

![Web app ran on a virtual device](run-wasm-app.png){width=600}

</tab>
</tabs>

## 문제 해결

### Java 및 JDK

Java의 일반적인 문제:

*   일부 도구가 실행할 Java 버전을 찾지 못하거나 잘못된 버전을 사용할 수 있습니다. 이를 해결하려면:
    *   적절한 JDK가 설치된 디렉토리로 `JAVA_HOME` 환경 변수를 설정합니다.

    > 클래스 재정의를 지원하는 OpenJDK 포크인 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) 사용을 권장합니다.
    >
    {style="note"}

    *   JDK에 포함된 도구를 터미널에서 사용할 수 있도록 `JAVA_HOME` 내의 `bin` 폴더 경로를 `PATH` 변수에 추가합니다.
*   Android Studio에서 Gradle JDK와 관련된 문제가 발생하면 올바르게 구성되었는지 확인하십시오: **Settings** | **Build, Execution, Deployment** | **Build Tools** | **Gradle**을 선택합니다.

### Android 도구

JDK와 마찬가지로, `adb`와 같은 Android 도구를 실행하는 데 문제가 있다면 `ANDROID_HOME/tools`, `ANDROID_HOME/tools/bin` 및 `ANDROID_HOME/platform-tools` 경로가 `PATH` 환경 변수에 추가되었는지 확인하십시오.

### Xcode

iOS 실행 구성에 실행할 가상 장치가 없다고 보고되는 경우, Xcode를 실행하여 iOS 시뮬레이터에 대한 업데이트가 있는지 확인하십시오.

### 도움 받기

*   **Kotlin Slack**. [초대장](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)을 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하십시오.
*   **Kotlin Multiplatform Tooling 이슈 트래커**. [새로운 이슈 보고](https://youtrack.jetbrains.com/newIssue?project=KMT).

## 다음 단계

KMP 프로젝트의 구조 및 공유 코드 작성에 대해 자세히 알아보십시오:
*   공유 UI 코드 작업에 대한 튜토리얼 시리즈: [](compose-multiplatform-create-first-app.md)
*   네이티브 UI와 함께 공유 코드 작업에 대한 튜토리얼 시리즈: [](multiplatform-create-first-app.md)
*   Kotlin Multiplatform 문서 심층 탐구:
    *   [프로젝트 구성](multiplatform-project-configuration.md)
    *   [멀티플랫폼 종속성 작업](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
*   Compose Multiplatform UI 프레임워크, 그 기본 사항 및 플랫폼별 기능에 대해 알아보십시오: [](compose-multiplatform-and-jetpack-compose.md).

KMP용으로 작성된 코드 탐색:
*   공식 JetBrains 샘플과 KMP 기능을 보여주는 선별된 프로젝트 목록이 있는 [샘플](multiplatform-samples.md) 페이지.
*   GitHub 토픽:
    *   [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform), Kotlin Multiplatform로 구현된 프로젝트.
    *   [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample), KMP로 작성된 샘플 프로젝트 목록.
*   [klibs.io](https://klibs.io) – KMP 라이브러리 검색 플랫폼으로, 현재까지 OkHttp, Ktor, Coil, Koin, SQLDelight 등을 포함하여 2000개 이상의 라이브러리가 인덱싱되어 있습니다.