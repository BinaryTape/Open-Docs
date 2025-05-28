[//]: # (title: 크로스 플랫폼 모바일 애플리케이션 생성하기)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmm"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>영상</b>: <a href="https://youtu.be/_Q62iJoNOfg">Kotlin Multiplatform Mobile 프로젝트에서 네트워킹을 위한 Ktor 사용하기</a>
</p>
</tldr>

<link-summary>
Kotlin Multiplatform Mobile 애플리케이션을 만드는 방법을 알아보세요.
</link-summary>

Ktor HTTP 클라이언트는 멀티플랫폼 프로젝트에서 사용할 수 있습니다. 이 튜토리얼에서는 요청을 전송하고 응답 본문을 일반 HTML 텍스트로 수신하는 간단한 Kotlin Multiplatform Mobile 애플리케이션을 만들 것입니다.

> 첫 번째 Kotlin Multiplatform Mobile 애플리케이션을 만드는 방법을 알아보려면 [첫 번째 크로스 플랫폼 모바일 앱 만들기](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)를 참조하세요.

## 전제 조건 {id="prerequisites"}

먼저, 적절한 운영 체제에 필요한 도구를 설치하여 크로스 플랫폼 모바일 개발 환경을 설정해야 합니다. 자세한 내용은 [환경 설정](https://kotlinlang.org/docs/multiplatform-mobile-setup.html) 섹션에서 알아보세요.

> 이 튜토리얼의 특정 단계(iOS 전용 코드 작성 및 iOS 애플리케이션 실행 포함)를 완료하려면 macOS가 설치된 Mac이 필요합니다.
>
{style="note"}

## 새 프로젝트 생성 {id="new-project"}

새 Kotlin Multiplatform 프로젝트를 시작하는 방법에는 두 가지가 있습니다:

- Android Studio 내에서 템플릿을 사용하여 프로젝트를 생성할 수 있습니다.
- 또는, [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/)를 사용하여 새 프로젝트를 생성할 수 있습니다. 이 마법사는 프로젝트 설정을 사용자 지정하는 옵션을 제공하여 Android 지원을 제외하거나 Ktor 서버를 포함하는 등의 작업을 할 수 있습니다.

이 튜토리얼에서는 템플릿에서 프로젝트를 생성하는 과정을 보여줄 것입니다:

1. Android Studio에서 **파일 | 새로 만들기 | 새 프로젝트**를 선택합니다.
2. 프로젝트 템플릿 목록에서 **Kotlin Multiplatform 앱**을 선택하고 **다음**을 클릭합니다.
3. 애플리케이션 이름을 지정하고 **다음**을 클릭합니다. 이 튜토리얼에서는 애플리케이션 이름이 `KmmKtor`입니다.
4. 다음 페이지에서 기본 설정을 유지하고 **완료**를 클릭하여 새 프로젝트를 생성합니다. 이제 프로젝트가 설정될 때까지 기다리세요. 처음 수행할 때 필요한 구성 요소를 다운로드하고 설정하는 데 시간이 걸릴 수 있습니다.
   > 생성된 멀티플랫폼 프로젝트의 전체 구조를 보려면 [프로젝트 뷰](https://developer.android.com/studio/projects#ProjectView)에서 **Android**를 **Project**로 전환하세요.

## 빌드 스크립트 구성 {id="build-script"}

### Kotlin Gradle 플러그인 업데이트 {id="update_gradle_plugins"}

`gradle/libs.versions.toml` 파일을 열고 Kotlin 버전을 최신으로 업데이트하세요:

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="3"}

<include from="client-engines.md" element-id="newmm-note"/>

### Ktor 의존성 추가 {id="ktor-dependencies"}

프로젝트에서 Ktor HTTP 클라이언트를 사용하려면 최소 두 가지 의존성(클라이언트 의존성과 엔진 의존성)을 추가해야 합니다.

`gradle/libs.versions.toml` 파일에 Ktor 버전을 추가합니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5"}

<include from="client-create-new-application.topic" element-id="eap-note"/>

그런 다음, Ktor 클라이언트 및 엔진 라이브러리를 정의합니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="11,19-21"}

의존성을 추가하려면 `shared/build.gradle.kts` 파일을 열고 아래 단계를 따르세요:

1. 공통 코드에서 Ktor 클라이언트를 사용하려면 `commonMain` 소스 세트에 `ktor-client-core` 의존성을 추가합니다:
   ```kotlin
   ```
   {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-28,30,40"}

2. 각 필수 플랫폼에 해당하는 소스 세트에 [엔진 의존성](client-engines.md)을 추가합니다:
    - Android의 경우, `androidMain` 소스 세트에 `ktor-client-okhttp` 의존성을 추가합니다:
      ```kotlin
      ```
      {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="34-36"}

      Android의 경우, [다른 엔진 유형](client-engines.md#jvm-android)도 사용할 수 있습니다.
    - iOS의 경우, `iosMain`에 `ktor-client-darwin` 의존성을 추가합니다:
      ```kotlin
      ```
      {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="37-39"}

### 코루틴 추가 {id="coroutines"}

[Android 코드](#android-activity)에서 코루틴을 사용하려면 프로젝트에 `kotlinx.coroutines`를 추가해야 합니다:

1. `gradle/libs.versions.toml` 파일을 열고 코루틴 버전과 라이브러리를 지정합니다:

    ```kotlin
    ```
   {src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,4,10-11,22-23"}

2. `build.gradle.kts` 파일을 열고 `commonMain` 소스 세트에 `kotlinx-coroutines-core` 의존성을 추가합니다:

    ```kotlin
    ```
   {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-30,40"}

3. 그런 다음, `androidApp/build.gradle.kts`를 열고 `kotlinx-coroutines-android` 의존성을 추가합니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/androidApp/build.gradle.kts" include-lines="41,47,49"}

`gradle.properties` 파일 오른쪽 상단에 있는 **지금 동기화**를 클릭하여 추가된 의존성을 설치합니다.

## 애플리케이션 업데이트 {id="code"}

### 공유 코드 {id="shared-code"}

Android와 iOS 간에 공유되는 코드를 업데이트하려면 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 파일을 열고 `Greeting` 클래스에 다음 코드를 추가합니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt"}

- HTTP 클라이언트를 생성하려면 `HttpClient` 생성자가 호출됩니다.
- 정지 함수(suspending function)인 `greeting` 함수는 [요청](client-requests.md)을 수행하고 [응답](client-responses.md) 본문을 문자열 값으로 수신하는 데 사용됩니다.

### Android 코드 {id="android-activity"}

Android 코드에서 정지 함수(suspending function)인 `greeting` 함수를 호출하기 위해 [rememberCoroutineScope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))를 사용할 것입니다.

`androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt` 파일을 열고 `MainActivity` 코드를 다음과 같이 업데이트합니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt"}

생성된 스코프 내에서 공유된 `greeting` 함수를 호출하고 가능한 예외를 처리할 수 있습니다.

### iOS 코드 {id="ios-view"}

1. `iosApp/iosApp/iOSApp.swift` 파일을 열고 애플리케이션의 진입점을 업데이트합니다:
   ```Swift
   ```
   {src="snippets/tutorial-client-kmm/iosApp/iosApp/iOSApp.swift"}

2. `iosApp/iosApp/ContentView.swift` 파일을 열고 `ContentView` 코드를 다음과 같이 업데이트합니다:
   ```Swift
   ```
   {src="snippets/tutorial-client-kmm/iosApp/iosApp/ContentView.swift"}

   iOS에서는 `greeting` 정지 함수(suspending function)가 콜백이 있는 함수로 사용 가능합니다.

## Android에서 인터넷 접근 활성화 {id="android-internet"}

마지막으로 해야 할 일은 Android 애플리케이션의 인터넷 접근을 활성화하는 것입니다. `androidApp/src/main/AndroidManifest.xml` 파일을 열고 `uses-permission` 요소를 사용하여 필요한 권한을 활성화합니다:

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest>
```

## 애플리케이션 실행 {id="run"}

생성된 멀티플랫폼 애플리케이션을 Android 또는 iOS 시뮬레이터에서 실행하려면 **androidApp** 또는 **iosApp**을 선택하고 **실행**을 클릭합니다. 시뮬레이터에 수신된 HTML 문서가 일반 텍스트로 표시되어야 합니다.

<tabs>
<tab title="Android">

![Android simulator](tutorial_client_kmm_android.png){width="381"}

</tab>
<tab title="iOS">

![iOS simulator](tutorial_client_kmm_ios.png){width="351"}

</tab>
</tabs>