[//]: # (title: 애플리케이션 게시)

앱 출시 준비가 완료되면, 게시를 통해 사용자에게 앱을 전달할 차례입니다.

모바일 앱의 경우 각 플랫폼마다 여러 스토어를 이용할 수 있습니다. 하지만 이 글에서는 공식 스토어인 [Google Play 스토어](https://play.google.com/store)와 [Apple App Store](https://www.apple.com/ios/app-store/)에 중점을 둡니다. 웹 앱의 경우 [GitHub Pages](https://pages.github.com/)를 사용할 것입니다.

Kotlin Multiplatform 애플리케이션을 게시를 위해 준비하는 방법을 알아보고, 이 과정에서 특별히 주의해야 할 부분을 강조할 것입니다.

## Android 앱

[Kotlin은 Android 개발의 주요 언어](https://developer.android.com/kotlin)이므로, Kotlin Multiplatform는 프로젝트 컴파일 및 Android 앱 빌드에 명백한 영향을 미치지 않습니다. 공유 모듈에서 생성된 Android 라이브러리와 Android 앱 자체는 모두 일반적인 Android Gradle 모듈입니다. 다른 Android 라이브러리 및 앱과 다르지 않습니다. 따라서 Kotlin Multiplatform 프로젝트에서 Android 앱을 게시하는 것은 [Android 개발자 문서](https://developer.android.com/studio/publish)에 설명된 일반적인 프로세스와 다르지 않습니다.

## iOS 앱

Kotlin Multiplatform 프로젝트의 iOS 앱은 일반적인 Xcode 프로젝트에서 빌드되므로, 앱 게시와 관련된 주요 단계는 [iOS 개발자 문서](https://developer.apple.com/ios/submit/)에 설명된 것과 동일합니다.

> Spring'24 App Store 정책 변경으로 인해, 개인정보 보호 매니페스트(privacy manifests)가 누락되거나 불완전할 경우 앱에 대한 경고 또는 거부로 이어질 수 있습니다.
> 특히 Kotlin Multiplatform 앱의 세부 정보 및 해결 방법은 [iOS 앱의 개인정보 보호 매니페스트](https://kotlinlang.org/docs/apple-privacy-manifest.html)를 참조하세요.
>
{style="note"}

Kotlin Multiplatform 프로젝트에 특유한 점은 공유 Kotlin 모듈을 프레임워크로 컴파일하고 이를 Xcode 프로젝트에 연결하는 것입니다. 일반적으로 공유 모듈과 Xcode 프로젝트 간의 통합은 [Android Studio용 Kotlin Multiplatform 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)에 의해 자동으로 수행됩니다. 그러나 플러그인을 사용하지 않는다면, Xcode에서 iOS 프로젝트를 빌드하고 번들링할 때 다음 사항을 유의하십시오.

*   공유 Kotlin 라이브러리는 네이티브 프레임워크로 컴파일됩니다.
*   특정 플랫폼용으로 컴파일된 프레임워크를 iOS 앱 프로젝트에 연결해야 합니다.
*   Xcode 프로젝트 설정에서 빌드 시스템이 검색할 프레임워크의 경로를 지정하십시오.
*   프로젝트 빌드 후에는 앱을 실행하고 테스트하여 런타임에 프레임워크 작업 시 문제가 없는지 확인해야 합니다.

공유 Kotlin 모듈을 iOS 프로젝트에 연결하는 두 가지 방법이 있습니다.
*   [Kotlin CocoaPods Gradle 플러그인](multiplatform-cocoapods-overview.md)을 사용합니다. 이 플러그인을 사용하면 네이티브 타겟을 포함하는 멀티플랫폼 프로젝트를 iOS 프로젝트의 CocoaPods 종속성으로 사용할 수 있습니다.
*   Multiplatform 프로젝트를 수동으로 구성하여 iOS 프레임워크를 생성하고, Xcode 프로젝트가 최신 버전을 가져오도록 합니다.
    Kotlin Multiplatform 마법사 또는 Android Studio용 Kotlin Multiplatform 플러그인이 일반적으로 이 구성을 수행합니다.
    Xcode에서 프레임워크를 직접 추가하는 방법을 알아보려면 [iOS 프로젝트에 프레임워크 연결](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)을 참조하십시오.

### iOS 애플리케이션 구성

Xcode 없이 결과 앱에 영향을 미치는 기본 속성을 구성할 수 있습니다.

#### 번들 ID

[번들 ID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion)는 운영 체제에서 앱을 고유하게 식별합니다. 이를 변경하려면 Android Studio에서 `iosApp/Configuration/Config.xcconfig` 파일을 열고 `BUNDLE_ID`를 업데이트하십시오.

#### 앱 이름

앱 이름은 타겟 실행 파일과 애플리케이션 번들 이름을 설정합니다. 앱 이름을 변경하려면:

*   Android Studio에서 프로젝트를 아직 열지 않았다면, 어떤 텍스트 편집기에서든 `iosApp/Configuration/Config.xcconfig` 파일의 `APP_NAME` 옵션을 직접 변경할 수 있습니다.
*   Android Studio에서 프로젝트를 이미 열었다면, 다음을 수행하십시오.

    1.  프로젝트를 닫습니다.
    2.  어떤 텍스트 편집기에서든 `iosApp/Configuration/Config.xcconfig` 파일의 `APP_NAME` 옵션을 변경합니다.
    3.  Android Studio에서 프로젝트를 다시 엽니다.

다른 설정을 구성해야 한다면 Xcode를 사용하십시오. Android Studio에서 프로젝트를 연 후, Xcode에서 `iosApp/iosApp.xcworkspace` 파일을 열고 거기서 변경하십시오.

### 크래시 리포트 심볼화

개발자가 앱을 개선할 수 있도록 iOS는 앱 크래시를 분석하는 수단을 제공합니다. 상세한 크래시 분석을 위해, iOS는 크래시 리포트의 메모리 주소를 함수나 줄 번호와 같은 소스 코드의 위치와 일치시키는 특별한 디버그 심볼(`.dSYM`) 파일을 사용합니다.

기본적으로 공유 Kotlin 모듈에서 생성된 iOS 프레임워크의 릴리스 버전에는 `.dSYM` 파일이 동반됩니다. 이는 공유 모듈 코드에서 발생하는 크래시를 분석하는 데 도움이 됩니다.

iOS 앱이 비트코드(bitcode)에서 재빌드되면, 해당 `dSYM` 파일은 유효하지 않게 됩니다. 이러한 경우를 위해, 공유 모듈을 디버그 정보를 자체 내부에 저장하는 정적 프레임워크로 컴파일할 수 있습니다. Kotlin 모듈에서 생성된 바이너리에서 크래시 리포트 심볼화를 설정하는 방법에 대한 지침은 [Kotlin/Native 문서](https://kotlinlang.org/docs/native-ios-symbolication.html)를 참조하십시오.

## 웹 앱

웹 애플리케이션을 게시하려면, 애플리케이션을 구성하는 컴파일된 파일과 리소스가 포함된 아티팩트를 생성해야 합니다. 이 아티팩트들은 GitHub Pages와 같은 웹 호스팅 플랫폼에 애플리케이션을 배포하는 데 필요합니다.

### 아티팩트 생성

**wasmJsBrowserDistribution** 작업을 실행하기 위한 실행 구성을 생성합니다.

1.  **Run | Edit Configurations** 메뉴 항목을 선택합니다.
2.  더하기(+) 버튼을 클릭하고 드롭다운 목록에서 **Gradle**을 선택합니다.
3.  **Tasks and arguments** 필드에 다음 명령어를 붙여넣습니다.

    ```shell
    wasmJsBrowserDistribution
    ```

4.  **OK**를 클릭합니다.

이제 이 구성을 사용하여 작업을 실행할 수 있습니다.

![Wasm 배포 작업 실행](compose-run-wasm-distribution-task.png){width=350}

작업이 완료되면 `composeApp/build/dist/wasmJs/productionExecutable` 디렉터리에서 생성된 아티팩트를 찾을 수 있습니다.

![아티팩트 디렉터리](compose-web-artifacts.png){width=400}

### GitHub Pages에 애플리케이션 게시

아티팩트가 준비되었으므로, 웹 호스팅 플랫폼에 애플리케이션을 배포할 수 있습니다.

1.  `productionExecutable` 디렉터리의 내용을 사이트를 생성하려는 리포지토리로 복사합니다.
2.  [GitHub Pages 사이트 생성](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)에 대한 GitHub의 지침을 따르십시오.

    > GitHub에 변경 사항을 푸시한 후 사이트 변경 사항이 게시되기까지 최대 10분이 소요될 수 있습니다.
    >
    {style="note"}

3.  브라우저에서 GitHub Pages 도메인으로 이동합니다.

    ![GitHub Pages로 이동](publish-your-application-on-web.png){width=650}

    축하합니다! GitHub Pages에 아티팩트를 게시했습니다.

### 웹 애플리케이션 디버그

웹 애플리케이션은 추가 구성 없이도 브라우저에서 바로 디버그할 수 있습니다. 브라우저에서 디버그하는 방법을 알아보려면 Kotlin 문서의 [브라우저에서 디버그](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser) 가이드를 참조하십시오.