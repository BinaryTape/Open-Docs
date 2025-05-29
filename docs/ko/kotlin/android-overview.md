[//]: # (title: Android용 Kotlin)

2019년 Google I/O 이후로 Android 모바일 개발은 [Kotlin-first](https://developer.android.com/kotlin/first)가 되었습니다.

전문 Android 개발자의 50% 이상이 Kotlin을 주 언어로 사용하고 있으며, Java를 주 언어로 사용하는 개발자는 30%에 불과합니다. Kotlin을 주 언어로 사용하는 개발자의 70%는 Kotlin이 생산성을 높여준다고 말합니다.

Android 개발에 Kotlin을 사용하면 다음과 같은 이점을 얻을 수 있습니다:

*   **적은 코드와 높은 가독성**. 코드 작성에 드는 시간을 줄이고 다른 사람의 코드를 이해하는 데 드는 노력도 줄일 수 있습니다.
*   **일반적인 오류 감소**. [Google의 내부 데이터](https://medium.com/androiddevelopers/fewer-crashes-and-more-stability-with-kotlin-b606c6a6ac04)에 따르면 Kotlin으로 빌드된 앱은 비정상 종료될 가능성이 20% 낮습니다.
*   **Jetpack 라이브러리의 Kotlin 지원**. [Jetpack Compose](https://developer.android.com/jetpack/compose)는 Kotlin으로 네이티브 UI를 빌드하기 위한 Android의 권장 현대식 툴킷입니다. [KTX 확장](https://developer.android.com/kotlin/ktx)은 코루틴, 확장 함수, 람다, 명명된 파라미터와 같은 Kotlin 언어 기능을 기존 Android 라이브러리에 추가합니다.
*   **멀티플랫폼 개발 지원**. Kotlin Multiplatform를 사용하면 Android뿐만 아니라 [iOS](https://kotlinlang.org/lp/multiplatform/), 백엔드 및 웹 애플리케이션 개발도 가능합니다. [일부 Jetpack 라이브러리](https://developer.android.com/kotlin/multiplatform)는 이미 멀티플랫폼을 지원합니다. Kotlin 및 Jetpack Compose를 기반으로 하는 JetBrains의 선언형 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)는 iOS, Android, 데스크톱, 웹 등 다양한 플랫폼에서 UI를 공유할 수 있도록 합니다.
*   **성숙한 언어 및 환경**. 2011년 생성된 이래로 Kotlin은 언어로서뿐만 아니라 강력한 툴링을 갖춘 전체 생태계로서 지속적으로 발전해 왔습니다. 현재는 [Android Studio](https://developer.android.com/studio)에 완벽하게 통합되어 있으며, 많은 회사에서 Android 애플리케이션 개발에 적극적으로 사용하고 있습니다.
*   **Java와의 상호 운용성**. 모든 코드를 Kotlin으로 마이그레이션할 필요 없이 애플리케이션에서 Java 프로그래밍 언어와 함께 Kotlin을 사용할 수 있습니다.
*   **쉬운 학습**. Kotlin은 특히 Java 개발자에게 매우 배우기 쉽습니다.
*   **방대한 커뮤니티**. Kotlin은 전 세계적으로 성장하고 있는 커뮤니티로부터 훌륭한 지원과 많은 기여를 받고 있습니다. 상위 1,000개 Android 앱 중 95% 이상이 Kotlin을 사용합니다.

많은 스타트업과 Fortune 500대 기업들이 이미 Kotlin을 사용하여 Android 애플리케이션을 개발했습니다. 자세한 내용은 [Android 개발자를 위한 Google 웹사이트](https://developer.android.com/kotlin/stories)에서 목록을 확인하세요.

Kotlin 사용 시작 방법:

*   Android 개발의 경우, [Kotlin으로 Android 앱을 개발하기 위한 Google 문서](https://developer.android.com/kotlin/get-started)를 참조하세요.
*   크로스 플랫폼 모바일 애플리케이션 개발의 경우, [공유 로직 및 네이티브 UI로 앱 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)를 참조하세요.