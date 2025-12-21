[//]: # (title: Android용 Kotlin)

2019년 Google I/O 이후 Android 모바일 개발은 [Kotlin-first](https://developer.android.com/kotlin/first) 방식을 채택했습니다.

전문 Android 개발자의 50% 이상이 Kotlin을 주력 언어로 사용하고 있으며, Java를 주 언어로 사용하는 개발자는 30%에 불과합니다. Kotlin을 주력 언어로 사용하는 개발자의 70%는 Kotlin이 생산성을 높여준다고 말합니다.

Android 개발에 Kotlin을 사용하면 다음과 같은 이점을 얻을 수 있습니다:

*   **코드 감소와 뛰어난 가독성**. 코드 작성 및 다른 사람의 코드 이해에 더 적은 시간을 할애할 수 있습니다.
*   **일반적인 오류 감소**. [Google의 내부 데이터](https://medium.com/androiddevelopers/fewer-crashes-and-more-stability-with-kotlin-b606c6a6ac04)에 따르면 Kotlin으로 빌드된 앱은 충돌할 가능성이 20% 더 낮습니다.
*   **Jetpack 라이브러리의 Kotlin 지원**. [Jetpack Compose](https://developer.android.com/jetpack/compose)는 Kotlin으로 네이티브 UI를 구축하기 위해 Android에서 권장하는 최신 툴킷입니다. [KTX 확장 기능](https://developer.android.com/kotlin/ktx)은 기존 Android 라이브러리에 코루틴(coroutines), 확장 함수(extension functions), 람다(lambdas), 명명된 매개변수(named parameters)와 같은 Kotlin 언어 기능을 추가합니다.
*   **멀티플랫폼 개발 지원**. Kotlin Multiplatform는 Android뿐만 아니라 [iOS](https://kotlinlang.org/multiplatform/), 백엔드, 웹 애플리케이션 개발도 가능하게 합니다. [일부 Jetpack 라이브러리](https://developer.android.com/kotlin/multiplatform)는 이미 멀티플랫폼을 지원합니다. Kotlin 및 Jetpack Compose를 기반으로 한 JetBrains의 선언형 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)는 iOS, Android, 데스크톱, 웹 등 플랫폼 간 UI를 공유할 수 있도록 합니다.
*   **성숙한 언어 및 환경**. 2011년 탄생 이후 Kotlin은 언어로서뿐만 아니라 강력한 도구(tooling)를 갖춘 전체 생태계(ecosystem)로서 지속적으로 발전해 왔습니다. 이제 [Android Studio](https://developer.android.com/studio)에 완벽하게 통합되었으며, 많은 회사에서 Android 애플리케이션 개발에 활발히 사용되고 있습니다.
*   **Java와의 상호 운용성**. 모든 코드를 Kotlin으로 마이그레이션할 필요 없이 애플리케이션에서 Kotlin을 Java 프로그래밍 언어와 함께 사용할 수 있습니다.
*   **쉬운 학습**. 특히 Java 개발자에게 Kotlin은 배우기 매우 쉽습니다.
*   **대규모 커뮤니티**. Kotlin은 전 세계적으로 성장하는 커뮤니티로부터 큰 지원과 많은 기여를 받고 있습니다. 상위 천 개 Android 앱 중 95% 이상이 Kotlin을 사용합니다.

많은 스타트업과 포춘 500대 기업이 이미 Kotlin을 사용하여 Android 애플리케이션을 개발했습니다. 자세한 목록은 [Android 개발자를 위한 Google 웹사이트](https://developer.android.com/kotlin/stories)에서 확인할 수 있습니다.

Kotlin 사용을 시작하려면:

*   Android 개발의 경우, [Kotlin으로 Android 앱 개발을 위한 Google 문서](https://developer.android.com/kotlin/get-started)를 참조하세요.
*   크로스 플랫폼 모바일 애플리케이션 개발의 경우, [공유 로직 및 네이티브 UI로 앱 만들기](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)를 참조하세요.