[//]: # (title: 애플리케이션 게시하기)

애플리케이션을 출시할 준비가 되었다면, 이제 이를 게시하여 사용자에게 전달할 차례입니다.

모바일 앱의 경우 각 플랫폼마다 여러 스토어를 이용할 수 있습니다. 하지만 이 문서에서는 공식 스토어인 [Google Play Store](https://play.google.com/store)와 [Apple App Store](https://www.apple.com/ios/app-store/)에 집중하겠습니다. 웹 앱의 경우에는 [GitHub pages](https://pages.github.com/)를 사용합니다. 

이 문서에서는 코틀린 멀티플랫폼(Kotlin Multiplatform) 애플리케이션의 게시 준비 방법을 알아보고, 이 과정에서 특별히 주의를 기울여야 할 부분들을 짚어보겠습니다.

## Android 앱

[코틀린은 Android 개발의 주요 언어](https://developer.android.com/kotlin)이므로, 코틀린 멀티플랫폼이 프로젝트 컴파일 및 Android 앱 빌드에 미치는 뚜렷한 영향은 없습니다. 공유 모듈(shared module)에서 생성된 Android 라이브러리와 Android 앱 자체는 모두 전형적인 Android Gradle 모듈이며, 다른 Android 라이브러리 및 앱과 다르지 않습니다. 따라서 코틀린 멀티플랫폼 프로젝트에서 Android 앱을 게시하는 방법은 [Android 개발자 문서](https://developer.android.com/studio/publish)에 설명된 일반적인 과정과 동일합니다.

## iOS 앱

코틀린 멀티플랫폼 프로젝트의 iOS 앱은 전형적인 Xcode 프로젝트에서 빌드되므로, 게시와 관련된 주요 단계는 [iOS 개발자 문서](https://developer.apple.com/ios/submit/)에 설명된 내용과 동일합니다.

> 2024년 봄 App Store 정책 변경으로 인해, 개인정보 보호 매니페스트(privacy manifests)가 누락되거나 불완전할 경우 앱에 대한 경고가 발생하거나 심지어 거부될 수 있습니다.
> 특히 코틀린 멀티플랫폼 앱에 대한 자세한 내용과 해결 방법은 [iOS 앱용 개인정보 보호 매니페스트](https://kotlinlang.org/docs/apple-privacy-manifest.html)를 참조하세요. 
>
{style="note"}

코틀린 멀티플랫폼 프로젝트의 특징은 공유 코틀린 모듈을 프레임워크(framework)로 컴파일하고 이를 Xcode 프로젝트에 연결하는 것입니다. 일반적으로 공유 모듈과 Xcode 프로젝트 간의 통합은 [Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)에 의해 자동으로 수행됩니다. 그러나 플러그인을 사용하지 않는 경우, Xcode에서 iOS 프로젝트를 빌드하고 번들링할 때 다음 사항을 유의하세요:

* 공유 코틀린 라이브러리는 네이티브 프레임워크로 컴파일됩니다.
* 특정 플랫폼용으로 컴파일된 프레임워크를 iOS 앱 프로젝트에 연결해야 합니다.
* Xcode 프로젝트 설정에서 빌드 시스템이 검색할 프레임워크 경로를 지정해야 합니다.
* 프로젝트를 빌드한 후에는 앱을 실행하고 테스트하여 런타임에서 프레임워크 작업 시 문제가 없는지 확인해야 합니다.

공유 코틀린 모듈을 iOS 프로젝트에 연결하는 방법은 두 가지가 있습니다:
* [Kotlin CocoaPods Gradle 플러그인](multiplatform-cocoapods-overview.md) 사용: 네이티브 타겟이 있는 멀티플랫폼 프로젝트를 iOS 프로젝트의 CocoaPods 종속성으로 사용할 수 있게 해줍니다.
* 공유 코틀린 모듈이 iOS 프레임워크를 생성하도록 수동으로 구성하고, Xcode 프로젝트가 최신 버전의 프레임워크를 가져오도록 구성합니다.
  코틀린 멀티플랫폼 위저드(wizard)나 코틀린 멀티플랫폼 IDE 플러그인이 보통 이 구성을 대신 처리해 줍니다. Xcode에서 직접 프레임워크를 추가하는 방법은 [iOS 프로젝트에 프레임워크 연결하기](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)를 참조하세요.

### iOS 애플리케이션 구성

Xcode 없이도 결과 앱에 영향을 미치는 기본 속성을 구성할 수 있습니다.

#### 번들 ID (Bundle ID)

[번들 ID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion)는 운영 체제에서 앱을 고유하게 식별합니다. 이를 변경하려면 Android Studio에서 `iosApp/Configuration/Config.xcconfig` 파일을 열고 `BUNDLE_ID`를 업데이트하세요.

#### 앱 이름

앱 이름은 타겟 실행 파일 및 애플리케이션 번들 이름을 설정합니다. 앱 이름을 변경하려면 다음 단계를 따르세요:

* 아직 Android Studio에서 프로젝트를 열지 않은 경우, 임의의 텍스트 편집기에서 `iosApp/Configuration/Config.xcconfig` 파일의 `APP_NAME` 옵션을 직접 변경할 수 있습니다.
* 이미 Android Studio에서 프로젝트를 연 적이 있다면 다음을 수행하세요:

  1. 프로젝트를 닫습니다.
  2. 임의의 텍스트 편집기에서 `iosApp/Configuration/Config.xcconfig` 파일의 `APP_NAME` 옵션을 변경합니다.
  3. Android Studio에서 프로젝트를 다시 엽니다.

다른 설정을 구성해야 하는 경우 Xcode를 사용하세요. Android Studio에서 프로젝트를 연 후, Xcode에서 `iosApp/iosApp.xcworkspace` 파일을 열고 변경 사항을 적용하면 됩니다.

### 크래시 리포트 심볼 복원 (Symbolicating crash reports)

iOS는 개발자가 앱을 개선하는 데 도움이 되도록 앱 크래시를 분석하는 수단을 제공합니다. 상세한 크래시 분석을 위해, 크래시 리포트의 메모리 주소를 함수나 줄 번호와 같은 소스 코드 위치와 매칭하는 특별한 디버그 심볼(`.dSYM`) 파일을 사용합니다.

기본적으로 공유 코틀린 모듈에서 생성된 iOS 프레임워크의 릴리스 버전에는 `.dSYM` 파일이 함께 제공됩니다. 이를 통해 공유 모듈의 코드에서 발생하는 크래시를 분석할 수 있습니다.

크래시 리포트 심볼 복원(symbolication)에 대한 자세한 정보는 [Kotlin/Native 문서](https://kotlinlang.org/docs/native-debugging.html#debug-ios-applications)를 참조하세요.

## 웹 앱

웹 애플리케이션을 게시하려면 애플리케이션을 구성하는 컴파일된 파일과 리소스가 포함된 아티팩트(artifacts)를 생성해야 합니다. 이러한 아티팩트는 GitHub Pages와 같은 웹 호스팅 플랫폼에 애플리케이션을 배포하는 데 필요합니다.

### 아티팩트 생성

**wasmJsBrowserDistribution** 태스크를 실행하기 위한 실행 구성(run configuration)을 생성합니다:

1. 메뉴에서 **Run | Edit Configurations**를 선택합니다.
2. 더하기(+) 버튼을 클릭하고 드롭다운 목록에서 **Gradle**을 선택합니다.
3. **Tasks and arguments** 필드에 다음 명령을 붙여넣습니다:

   ```shell
   wasmJsBrowserDistribution
   ```

4. **OK**를 클릭합니다.

이제 이 구성을 사용하여 태스크를 실행할 수 있습니다:

![Wasm 배포 태스크 실행](compose-run-wasm-distribution-task.png){width=350}

태스크가 완료되면 `sharedUI/build/dist/wasmJs/productionExecutable` 디렉터리에서 생성된 아티팩트를 확인할 수 있습니다:

![아티팩트 디렉터리](compose-web-artifacts.png){width=400}

### GitHub Pages에 애플리케이션 게시하기

아티팩트가 준비되면 웹 호스팅 플랫폼에 애플리케이션을 배포할 수 있습니다:

1. `productionExecutable` 디렉터리의 내용을 사이트를 생성하려는 저장소(repository)로 복사합니다.
2. GitHub의 [사이트 생성 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)를 따릅니다.

   > 변경 사항을 GitHub에 푸시한 후 사이트가 게시되기까지 최대 10분이 걸릴 수 있습니다.
   >
   {style="note"}

3. 브라우저에서 본인의 GitHub Pages 도메인으로 이동합니다.

   ![GitHub Pages로 이동](publish-your-application-on-web.png){width=650}

   축하합니다! 아티팩트를 GitHub Pages에 게시했습니다.

### 웹 애플리케이션 디버깅

별도의 구성 없이 브라우저에서 즉시 웹 애플리케이션을 디버깅할 수 있습니다. 브라우저에서 디버깅하는 방법은 코틀린 문서의 [브라우저에서 디버깅하기](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser) 가이드를 참조하세요.