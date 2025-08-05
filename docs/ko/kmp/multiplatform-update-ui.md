[//]: # (title: 사용자 인터페이스 업데이트)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼에서는 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 튜토리얼은 **공유 로직과 네이티브 UI를 사용하는 Kotlin 멀티플랫폼 앱 만들기** 튜토리얼의 두 번째 파트입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">Kotlin 멀티플랫폼 앱 만들기</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>사용자 인터페이스 업데이트</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 종속성 추가<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 더 많은 로직 공유하기<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 프로젝트 마무리하기<br/>
    </p>
</tldr>

사용자 인터페이스를 빌드하려면 프로젝트의 Android 부분에는 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 툴킷을 사용하고, iOS 부분에는 [SwiftUI](https://developer.apple.com/xcode/swiftui/)를 사용할 것입니다. 이 둘은 모두 선언형(declarative) UI 프레임워크이며, UI 구현에서 유사점을 발견할 수 있을 것입니다. 두 경우 모두, 데이터를 `phrases` 변수에 저장한 다음 이를 반복하여 `Text` 항목 목록을 생성합니다.

## Android 부분 업데이트

`composeApp` 모듈은 Android 애플리케이션을 포함하며, 해당 메인 액티비티와 UI 뷰를 정의하고, `shared` 모듈을 일반 Android 라이브러리로 사용합니다. 애플리케이션의 UI는 Compose Multiplatform 프레임워크를 사용합니다.

변경 사항을 적용하고 UI에 어떻게 반영되는지 확인해 보세요.

1.  `composeApp/src/androidMain/kotlin`에서 `App.kt` 파일로 이동합니다.
2.  `Greeting` 클래스 호출을 찾으세요. `greet()` 함수를 선택하고 마우스 오른쪽 버튼을 클릭한 다음 **이동(Go To)** | **선언 또는 사용(Declaration or Usages)**을 선택합니다. 이전 단계에서 편집했던 `shared` 모듈의 동일한 클래스임을 확인할 수 있습니다.
3.  `Greeting.kt` 파일에서 `greet()` 함수를 업데이트합니다.

   ```kotlin
   import kotlin.random.Random
   
   fun greet(): List<String> = buildList {
       add(if (Random.nextBoolean()) "Hi!" else "Hello!")
       add("Guess what this is! > ${platform.name.reversed()}!")
   }
   ```

   이제 문자열 목록을 반환합니다.

4.  `App.kt` 파일로 돌아가서 `App()` 구현을 업데이트합니다.

   ```kotlin
   @Composable
   @Preview
   fun App() {
       MaterialTheme {
           val greeting = remember { Greeting().greet() }
   
           Column(
               modifier = Modifier
                   .padding(all = 10.dp)
                   .safeContentPadding()
                   .fillMaxSize(),
               verticalArrangement = Arrangement.spacedBy(8.dp),
           ) {
               greeting.forEach { greeting ->
                   Text(greeting)
                   HorizontalDivider()
               }
           }
       }
   }
   ```

   여기서 `Column` 컴포저블은 각 `Text` 항목을 표시하며, 주변에 패딩을 추가하고 항목들 사이에 공간을 둡니다.

5.  누락된 종속성(dependency)을 임포트하려면 IntelliJ IDEA의 제안을 따르세요.
6.  이제 Android 앱을 실행하여 문자열 목록이 어떻게 표시되는지 확인할 수 있습니다.

   ![Updated UI of Android multiplatform app](first-multiplatform-project-on-android-2.png){width=300}

## iOS 모듈 작업하기

`iosApp` 디렉터리는 iOS 애플리케이션으로 빌드됩니다. 이 디렉터리는 `shared` 모듈을 iOS 프레임워크로 의존하고 사용합니다. 앱의 UI는 Swift로 작성되었습니다.

Android 앱과 동일한 변경 사항을 구현합니다.

1.  IntelliJ IDEA에서 **프로젝트(Project)** 도구 창에 있는 프로젝트 루트의 `iosApp` 폴더를 찾으세요.
2.  `ContentView.swift` 파일을 열고, `Greeting().greet()` 호출을 마우스 오른쪽 버튼으로 클릭한 다음 **이동(Go To)** | **정의(Definition)**를 선택합니다.

    `shared` 모듈에 정의된 Kotlin 함수의 Objective-C 선언을 볼 수 있습니다. Kotlin 타입은 Objective-C/Swift에서 사용될 때 Objective-C 타입으로 표현됩니다. 여기서는 `greet()` 함수가 Kotlin에서는 `List<String>`을 반환하고 Swift에서는 `NSArray<NSString>`을 반환하는 것으로 보입니다. 타입 매핑에 대한 자세한 내용은 [Swift/Objective-C와의 상호 운용성](https://kotlinlang.org/docs/native-objc-interop.html)을 참조하세요.

3.  SwiftUI 코드를 업데이트하여 Android 앱과 동일한 방식으로 항목 목록을 표시합니다.

    ```Swift
    struct ContentView: View {
       let phrases = Greeting().greet()
    
       var body: some View {
           List(phrases, id: \.self) {
               Text($0)
           }
       }
    }
    ```

    *   `greet()` 호출 결과는 `phrases` 변수에 저장됩니다 (Swift의 `let`은 Kotlin의 `val`과 유사합니다).
    *   `List` 함수는 `Text` 항목 목록을 생성합니다.

4.  iOS 실행 구성을 시작하여 변경 사항을 확인합니다.

    ![Updated UI of your iOS multiplatform app](first-multiplatform-project-on-ios-2.png){width=300}

## 가능한 문제 및 해결책

### Xcode에서 공유 프레임워크 호출 코드에 오류가 발생할 경우

Xcode를 사용하는 경우, Xcode 프로젝트가 이전 버전의 프레임워크를 계속 사용하고 있을 수 있습니다. 이 문제를 해결하려면 IntelliJ IDEA로 돌아가 프로젝트를 재빌드하거나 iOS 실행 구성을 시작하세요.

### Xcode에서 공유 프레임워크 임포트 시 오류가 발생할 경우

Xcode를 사용하는 경우, 캐시된 바이너리(binary)를 지워야 할 수 있습니다. 메인 메뉴에서 **제품(Product) | 빌드 폴더 정리(Clean Build Folder)**를 선택하여 환경을 재설정해 보세요.

## 다음 단계

튜토리얼의 다음 부분에서는 종속성(dependency)에 대해 알아보고, 프로젝트의 기능을 확장하기 위해 서드파티 라이브러리(third-party library)를 추가하는 방법을 배울 것입니다.

**[다음 파트로 진행하기](multiplatform-dependencies.md)**

## 도움 받기

*   **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받아 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
*   **Kotlin 이슈 트래커**. [새로운 이슈 신고](https://youtrack.jetbrains.com/newIssue?project=KT).