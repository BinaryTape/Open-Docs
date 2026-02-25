[//]: # (title: Android를 위한 Kotlin)

Android 모바일 개발은 2019년 Google I/O 이후로 [Kotlin-first](https://developer.android.com/kotlin/first)(코틀린 우선) 원칙을 고수해 왔습니다.

전문 Android 개발자의 50% 이상이 Kotlin을 주력 언어로 사용하고 있으며, Java를 주력 언어로 사용하는 비율은 30%에 불과합니다. Kotlin을 주력 언어로 사용하는 개발자의 70%는 Kotlin이 생산성을 높여준다고 답했습니다.

Android 개발에 Kotlin을 사용하면 다음과 같은 이점을 누릴 수 있습니다:

* **코드량 감소 및 가독성 향상**. 코드를 작성하고 다른 사람의 코드를 이해하는 데 드는 시간을 단축할 수 있습니다.
* **일반적인 오류 감소**. [Google의 내부 데이터](https://medium.com/androiddevelopers/fewer-crashes-and-more-stability-with-kotlin-b606c6a6ac04)에 따르면, Kotlin으로 빌드된 앱은 크래시 발생 확률이 20% 더 낮습니다.
* **Jetpack 라이브러리의 Kotlin 지원**. [Jetpack Compose](https://developer.android.com/jetpack/compose)는 Kotlin으로 네이티브 UI를 빌드하기 위해 권장되는 Android의 현대적인 툴킷입니다. [KTX 확장(KTX extensions)](https://developer.android.com/kotlin/ktx)은 코루틴(coroutine), 확장 함수(extension function), 람다(lambda), 이름 있는 인자(named parameter)와 같은 Kotlin 언어 기능을 기존 Android 라이브러리에 추가합니다.
* **멀티플랫폼 개발 지원**. Kotlin Multiplatform을 사용하면 Android뿐만 아니라 [iOS](https://kotlinlang.org/multiplatform/), 백엔드, 웹 애플리케이션까지 개발할 수 있습니다. [일부 Jetpack 라이브러리](https://developer.android.com/kotlin/multiplatform)는 이미 멀티플랫폼을 지원합니다. JetBrains의 Kotlin 및 Jetpack Compose 기반 선언형 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)을 사용하면 iOS, Android, 데스크톱 및 웹 간에 UI를 공유할 수 있습니다.
* **성숙한 언어 및 환경**. 2011년 탄생 이후 Kotlin은 언어 자체뿐만 아니라 강력한 도구를 갖춘 전체 생태계로서 지속적으로 발전해 왔습니다. 현재 Kotlin은 [Android Studio](https://developer.android.com/studio)에 완벽하게 통합되어 있으며, 수많은 기업에서 Android 애플리케이션 개발에 활발히 사용하고 있습니다.
* **Java와의 상호 운용성**. 모든 코드를 Kotlin으로 마이그레이션할 필요 없이 애플리케이션에서 Java 프로그래밍 언어와 함께 Kotlin을 사용할 수 있습니다.
* **쉬운 학습**. Kotlin은 배우기 매우 쉬우며, 특히 Java 개발자에게 더욱 그렇습니다.
* **거대한 커뮤니티**. Kotlin은 전 세계적으로 성장하고 있는 커뮤니티로부터 훌륭한 지원과 수많은 기여를 받고 있습니다. 상위 1,000개 Android 앱 중 95% 이상이 Kotlin을 사용합니다.

이미 많은 스타트업과 Fortune 500대 기업들이 Kotlin을 사용하여 Android 애플리케이션을 개발하고 있습니다. [Android 개발자를 위한 Google 웹사이트](https://developer.android.com/kotlin/stories)에서 목록을 확인해 보세요.

다음 목적으로 Kotlin 사용을 시작해 보세요:

* Android 개발: [Kotlin을 사용한 Android 앱 개발에 대한 Google 문서](https://developer.android.com/kotlin/get-started)를 참고하세요.
* 크로스 플랫폼 모바일 애플리케이션 개발: [공유 로직 및 네이티브 UI를 갖춘 앱 만들기](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)를 참고하세요.