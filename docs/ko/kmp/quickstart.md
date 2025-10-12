[//]: # (title: Kotlin Multiplatform 빠른 시작)

<web-summary>JetBrains는 IntelliJ IDEA와 Android Studio에 공식 Kotlin IDE 지원을 제공합니다.</web-summary>

이 튜토리얼을 통해 간단한 Kotlin Multiplatform 앱을 빠르게 실행할 수 있습니다.

## 환경 설정

Kotlin Multiplatform (KMP) 프로젝트에는 특정 환경이 필요하지만,
대부분의 요구 사항은 IDE의 사전 검사를 통해 명확히 알 수 있습니다.

IDE와 필요한 플러그인부터 시작하세요:

1.  IDE를 선택하고 설치하세요.
    Kotlin Multiplatform은 IntelliJ IDEA와 Android Studio에서 지원되므로 원하는 IDE를 사용할 수 있습니다.

    [JetBrains Toolbox 앱](https://www.jetbrains.com/toolbox/app/)은 IDE 설치에 권장되는 도구입니다.
    이 앱을 사용하면 [얼리 액세스 프로그램](https://www.jetbrains.com/resources/eap/)(EAP) 및 나이틀리 릴리스를 포함한
    여러 제품 또는 버전을 관리할 수 있습니다.

    단독 설치의 경우, [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
    또는 [Android Studio](https://developer.android.com/studio)용 설치 프로그램을 다운로드하세요.

    Kotlin Multiplatform에 필요한 플러그인은 최소 **IntelliJ IDEA 2025.1.1**
    또는 **Android Studio Narwhal 2025.1.1**을 요구합니다.

2.  [Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)을 설치하세요
    (Kotlin Multiplatform Gradle 플러그인과 혼동하지 마세요).

    > Windows 및 Linux에서 Kotlin Multiplatform 플러그인을 사용하려면 IntelliJ IDEA 2025.2.2가 필요합니다.
    > Android Studio는 향후 릴리스에서 Windows 및 Linux용 KMP IDE 플러그인 지원을 추가할 예정입니다.
    >
    {style="note"}

3.  IntelliJ IDEA용 Kotlin Multiplatform IDE 플러그인을 설치하면 아직 필요한 종속성이 없는 경우 모든 필수 종속성도 설치됩니다
    (Android Studio에는 모든 필수 플러그인이 번들로 제공됩니다).

4.  `ANDROID_HOME` 환경 변수가 설정되어 있지 않은 경우, 시스템이 이를 인식하도록 구성하세요:

    <Tabs>
    <TabItem title= "Bash 또는 Zsh">

    `.profile` 또는 `.zprofile`에 다음 명령을 추가하세요:

    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```

    </TabItem>
    <TabItem title= "Windows PowerShell 또는 CMD">

    PowerShell의 경우 다음 명령으로 영구 환경 변수를 추가할 수 있습니다
    (자세한 내용은 [PowerShell 문서](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)를 참조하세요):

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    CMD의 경우 [`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) 명령을 사용하세요:

    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </TabItem>
    </Tabs>

5.  iOS 애플리케이션을 생성하려면 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)가 설치된 macOS 호스트가 필요합니다.
    IDE는 iOS 프레임워크를 빌드하기 위해 내부적으로 Xcode를 실행합니다.

    KMP 프로젝트 작업을 시작하기 전에 Xcode를 최소 한 번 실행하여 초기 설정을 완료했는지 확인하세요.

    > Xcode가 업데이트될 때마다 수동으로 Xcode를 실행하고 업데이트된 도구를 다운로드해야 합니다.
    > Kotlin Multiplatform IDE 플러그인은 Xcode가 작업할 준비가 되지 않은 상태일 때마다 알려주는 사전 검사를 수행합니다.
    >
    {style="note"}

## 프로젝트 생성

<Tabs>
<TabItem title= "IntelliJ IDEA">

IDE 마법사를 사용하여 새 KMP 프로젝트를 생성하세요:

1.  메인 메뉴에서 **File** | **New** | **Project**를 선택합니다.
2.  왼쪽 목록에서 **Kotlin Multiplatform**을 선택합니다.
3.  필요에 따라 프로젝트의 이름, 위치 및 기타 기본 속성을 설정합니다.
4.  [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)(JBR) 버전을 프로젝트의 JDK로 선택하는 것을 권장합니다.
    JBR은 특히 데스크톱 KMP 앱의 호환성을 개선하는 데 중요한 수정 사항을 제공합니다.
    관련 JBR 버전은 모든 IntelliJ IDEA 배포판에 포함되어 있으므로 추가 설정이 필요하지 않습니다.
5.  프로젝트의 일부로 포함할 플랫폼을 선택하세요:
    *   모든 대상 플랫폼은 Compose Multiplatform을 사용하여 처음부터 UI 코드를 공유하도록 설정할 수 있습니다
        (UI 코드가 없는 서버 모듈 제외).
    *   iOS의 경우 두 가지 구현 방식 중 하나를 선택할 수 있습니다:
        *   Compose Multiplatform을 사용한 공유 UI 코드,
        *   SwiftUI로 만든 완전 네이티브 UI를 공유 로직이 있는 Kotlin 모듈에 연결.
    *   데스크톱 대상에는 해당 코드를 변경하는 즉시 UI 변경 사항을 확인할 수 있는 [Compose Hot Reload](compose-hot-reload.md) 기능의 베타 버전이 포함되어 있습니다.
        데스크톱 앱을 만들 계획이 없더라도 UI 코드 작성 속도를 높이기 위해 데스크톱 버전을 사용할 수 있습니다.

플랫폼 선택이 완료되면 **Create** 버튼을 클릭하고 IDE가 프로젝트를 생성하고 가져오도록 기다립니다.

![기본 설정과 Android, iOS, 데스크톱, 웹 플랫폼이 선택된 IntelliJ IDEA 마법사](idea-wizard-1step.png){width=800}

</TabItem>
<TabItem title= "Android Studio">

> KMP IDE 플러그인은 아직 Android Studio의 Windows 및 Linux 버전에서 지원되지 않습니다.
>
{style="warning"}

Kotlin Multiplatform IDE 플러그인은 K2 기능에 크게 의존하므로 K2 기능 없이 설명된 대로 작동하지 않습니다.
따라서 시작하기 전에 K2 모드가 활성화되어 있는지 확인하세요:
**Settings** | **Languages & Frameworks** | **Kotlin** | **Enable K2 mode**.

IDE 마법사를 사용하여 새 KMP 프로젝트를 생성하세요:

1.  메인 메뉴에서 **File** | **New** | **New project**를 선택합니다.
2.  기본 **Phone and Tablet** 템플릿 범주에서 **Kotlin Multiplatform**을 선택합니다.

    ![Android Studio의 첫 번째 새 프로젝트 단계](as-wizard-1.png){width="400"}

3.  필요에 따라 프로젝트의 이름, 위치 및 기타 기본 속성을 설정한 다음 **Next**를 클릭합니다.
4.  프로젝트의 일부로 포함할 플랫폼을 선택하세요:
    *   모든 대상 플랫폼은 Compose Multiplatform을 사용하여 처음부터 UI 코드를 공유하도록 설정할 수 있습니다
        (UI 코드가 없는 서버 모듈 제외).
    *   iOS의 경우 두 가지 구현 방식 중 하나를 선택할 수 있습니다:
        *   Compose Multiplatform을 사용한 공유 UI 코드,
        *   SwiftUI로 만든 완전 네이티브 UI를 공유 로직이 있는 Kotlin 모듈에 연결.
    *   데스크톱 대상에는 해당 코드를 변경하는 즉시 UI 변경 사항을 확인할 수 있는 [Compose Hot Reload](compose-hot-reload.md) 기능의 베타 버전이 포함되어 있습니다.
        데스크톱 앱을 만들 계획이 없더라도 UI 코드 작성 속도를 높이기 위해 데스크톱 버전을 사용할 수 있습니다.
5.  프로젝트가 생성되면 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)(JBR) 버전을 프로젝트의 JDK로 선택하는 것을 권장합니다. JBR은 특히 데스크톱 KMP 앱의 호환성을 개선하는 데 중요한 수정 사항을 제공하기 때문입니다.
    관련 JBR 버전은 모든 IntelliJ IDEA 배포판에 포함되어 있으므로 추가 설정이 필요하지 않습니다.

플랫폼 선택이 완료되면 **Finish** 버튼을 클릭하고 IDE가 프로젝트를 생성하고 가져오도록 기다립니다.

![Android, iOS, 데스크톱, 웹 플랫폼이 선택된 Android Studio 마법사의 마지막 단계](as-wizard-3step.png){width=800}

</TabItem>
</Tabs>

## 사전 검사 확인

**프로젝트 환경 사전 검사(Project Environment Preflight Checks)** 도구 창을 열어 프로젝트 설정에 환경 문제가 없는지 확인할 수 있습니다:
오른쪽 사이드바 또는 하단 바에서 사전 검사 아이콘을 클릭하세요 ![비행기 아이콘이 있는 사전 검사 아이콘](ide-preflight-checks.png){width="20"}

이 도구 창에서 이러한 검사와 관련된 메시지를 보고, 다시 실행하거나, 설정을 변경할 수 있습니다.

사전 검사 명령은 **Search Everywhere** 대화 상자에서도 사용할 수 있습니다.
<shortcut>Shift</shortcut> 키를 두 번 누르고 "preflight" 단어를 포함하는 명령을 검색하세요:

![Search Everywhere 메뉴에 "preflight" 단어가 입력됨](double-shift-preflight-checks.png)

## 샘플 앱 실행

IDE 마법사가 생성한 프로젝트에는 iOS, Android,
데스크톱, 웹 애플리케이션에 대한 실행 구성과 서버 앱 실행을 위한 Gradle 작업이 포함되어 있습니다.
각 플랫폼에 대한 특정 Gradle 명령은 아래에 나열되어 있습니다.

<Tabs>
<TabItem title="Android">

Android 앱을 실행하려면 **composeApp** 실행 구성을 시작하세요:

![Android 실행 구성이 강조 표시된 드롭다운](run-android-configuration.png){width=250}

Android 실행 구성을 수동으로 생성하려면, 실행 구성 템플릿으로 **Android App**을 선택하고
모듈 **[프로젝트 이름].composeApp**을 선택하세요.

기본적으로 사용 가능한 첫 번째 가상 장치에서 실행됩니다:

![가상 장치에서 실행된 Android 앱](run-android-app.png){width=350}

</TabItem>
<TabItem title="iOS">

> iOS 앱을 빌드하려면 macOS 호스트가 필요합니다.
>
{style="note"}

프로젝트에 iOS 대상을 선택하고 Xcode가 설치된 macOS 장치를 설정했다면,
**iosApp** 실행 구성을 선택하고 시뮬레이션된 장치를 선택할 수 있습니다:

![iOS 실행 구성이 강조 표시된 드롭다운](run-ios-configuration.png){width=250}

iOS 앱을 실행하면 내부적으로 Xcode로 빌드되고 iOS 시뮬레이터에서 실행됩니다.
첫 빌드 시 컴파일을 위한 네이티브 종속성을 수집하고, 이후 실행을 위한 빌드를 준비합니다:

![가상 장치에서 실행된 iOS 앱](run-ios-app.png){width=350}

</TabItem>
<TabItem title="Desktop">

데스크톱 앱의 기본 실행 구성은 **composeApp [desktop]**으로 생성됩니다:

![기본 데스크톱 실행 구성이 강조 표시된 드롭다운](run-desktop-configuration.png){width=250}

데스크톱 실행 구성을 수동으로 생성하려면, **Gradle** 실행 구성 템플릿을 선택하고
다음 명령과 함께 **[앱 이름]:composeApp** Gradle 프로젝트를 가리키세요:

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

이 구성으로 JVM 데스크톱 앱을 실행할 수 있습니다:

![가상 장치에서 실행된 JVM 앱](run-desktop-app.png){width=600}

</TabItem>
<TabItem title="Web">

웹 앱의 기본 실행 구성은 **composeApp [wasmJs]**로 생성됩니다:

![기본 Wasm 실행 구성이 강조 표시된 드롭다운](run-wasm-configuration.png){width=250}

웹 실행 구성을 수동으로 생성하려면, **Gradle** 실행 구성 템플릿을 선택하고
다음 명령과 함께 **[앱 이름]:composeApp** Gradle 프로젝트를 가리키세요:

```shell
wasmJsBrowserDevelopmentRun
```

이 구성을 실행하면 IDE는 Kotlin/Wasm 앱을 빌드하고 기본 브라우저에서 엽니다:

![가상 장치에서 실행된 웹 앱](run-wasm-app.png){width=600}

</TabItem>
</Tabs>

## 문제 해결

### Java 및 JDK

Java와 관련된 일반적인 문제:

*   일부 도구가 실행할 Java 버전을 찾지 못하거나 잘못된 버전을 사용할 수 있습니다.
    이를 해결하려면:
    *   `JAVA_HOME` 환경 변수를 적절한 JDK가 설치된 디렉토리로 설정하세요.

        > 클래스 재정의를 지원하는 OpenJDK 포크인 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)을 사용하는 것을 권장합니다.
        >
        {style="note"}

    *   `JAVA_HOME` 내의 `bin` 폴더 경로를 `PATH` 변수에 추가하여,
        JDK에 포함된 도구를 터미널에서 사용할 수 있도록 하세요.
*   Android Studio에서 Gradle JDK와 관련된 문제가 발생하면,
    **Settings** | **Build, Execution, Deployment** | **Build Tools** | **Gradle**에서 올바르게 구성되었는지 확인하세요.

### Android 도구

JDK와 마찬가지로 `adb`와 같은 Android 도구 실행에 문제가 있다면,
`ANDROID_HOME/tools`, `ANDROID_HOME/tools/bin`,
`ANDROID_HOME/platform-tools` 경로가 `PATH` 환경 변수에 추가되었는지 확인하세요.

### Xcode

iOS 실행 구성에서 실행할 가상 장치가 없다고 보고하거나 사전 검사가 실패하면, Xcode를 실행하고
iOS 시뮬레이터에 대한 업데이트가 있는지 확인하세요.

### 도움 받기

*   **Kotlin Slack**. [초대받고](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
*   **Kotlin Multiplatform Tooling 이슈 트래커**. [새 이슈를 보고하세요](https://youtrack.jetbrains.com/newIssue?project=KMT).

## 다음 단계

KMP 프로젝트의 구조와 공유 코드 작성에 대해 자세히 알아보세요:
*   공유 UI 코드 작업에 대한 튜토리얼 시리즈: [Compose Multiplatform 앱 생성](compose-multiplatform-create-first-app.md)
*   네이티브 UI와 함께 공유 코드 작업에 대한 튜토리얼 시리즈: [Kotlin Multiplatform 앱 생성](multiplatform-create-first-app.md)
*   Kotlin Multiplatform 문서를 심층 탐색:
    *   [프로젝트 구성](multiplatform-project-configuration.md)
    *   [멀티플랫폼 종속성 작업](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
*   Compose Multiplatform UI 프레임워크, 기본 사항 및 플랫폼별 기능에 대해 알아보세요:
    [Compose Multiplatform 및 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md).

KMP용으로 이미 작성된 코드를 살펴보세요:
*   공식 JetBrains 샘플과 KMP 기능을 보여주는 선별된 프로젝트 목록이 있는 [샘플](multiplatform-samples.md) 페이지.
*   GitHub 토픽:
    *   [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform), Kotlin Multiplatform으로 구현된 프로젝트.
    *   [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample),
        KMP로 작성된 샘플 프로젝트 목록.
*   [klibs.io](https://klibs.io) – 현재까지 OkHttp, Ktor, Coil, Koin, SQLDelight 등을 포함하여 2000개 이상의 라이브러리가 색인화된 KMP 라이브러리 검색 플랫폼.