[//]: # (title: 학습 자료)

<web-summary>자신의 KMP 경험 수준에 가장 적합한 학습 자료를 선택하세요.</web-summary>

이 가이드는 주요 Kotlin Multiplatform (KMP) 및 Compose Multiplatform 학습 자료를 엄선하여 제공합니다. 자신의 경험에 맞는 튜토리얼, 강좌, 아티클을 찾을 수 있도록 기술 수준별로 찾아보세요.

다음은 수준별 설명입니다:

🌱 **초급**. JetBrains 및 Google의 공식 튜토리얼을 통해 KMP 및 Compose의 기본 사항을 학습합니다. Room, Ktor, SQLDelight와 같은 핵심 라이브러리를 사용하여 간단한 앱을 구축합니다.

🌿 **중급**. 멀티플랫폼 ViewModel, Koin 기반 DI (Dependency Injection), 클린 아키텍처를 사용하여 실제 앱을 개발합니다. JetBrains 및 커뮤니티 교육자가 제공하는 강좌를 포함합니다.

🌳 **고급**. 백엔드 및 게임 개발 사용 사례, 대규모 다중 팀 프로젝트를 위한 아키텍처 확장 및 도입 가이드를 통해 완전한 KMP 엔지니어링으로 나아갑니다.

🧩 **라이브러리 개발자**. 재사용 가능한 KMP 라이브러리를 생성하고 게시합니다. 공식 JetBrains 도구 및 템플릿을 사용하여 API 설계, Dokka 문서화, Maven 게시 방법을 학습합니다.

<Tabs>
<TabItem id="all-resources" title="모두">

<snippet id="source">
<table>

<!-- BEGINNER BLOCK -->
<thead>

<tr>
<th>

**🎚**

</th>
<th>

**자료/**

**유형**

</th>
<th>

**제작자/**
**플랫폼**

</th>

<th>

**학습 내용**

</th>
<th>

**가격**

</th>
<th>

**예상 시간**

</th>
</tr>

</thead>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform overview](kmp-overview.md)

아티클

</td>
<td>
JetBrains
</td>

<td>
KMP의 핵심 가치를 파악하고, 실제 사용 사례를 확인하며, 프로젝트에 맞는 올바른 학습 경로를 찾습니다.
</td>
<td>
무료
</td>
<td>
30분
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Create Your First KMP App](multiplatform-create-first-app.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
KMP 프로젝트를 설정하고 Android와 iOS 간에 간단한 비즈니스 로직을 공유하면서 UI를 완전히 네이티브로 유지하는 방법.
</td>
<td>
무료
</td>
<td>
1-2시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Get Started With Kotlin Multiplatform (Google Codelab)](https://developer.android.com/codelabs/kmp-get-started)

튜토리얼

</td>
<td>
Google/ Android
</td>

<td>
기존 Android 프로젝트에 공유 KMP 모듈을 추가하고 SKIE 플러그인을 사용하여 Kotlin 코드에서 관용적인 Swift API를 생성하여 iOS와 통합하는 방법
</td>
<td>
무료
</td>
<td>
1-2시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Create Your First Compose Multiplatform App](compose-multiplatform-create-first-app.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
간단한 템플릿에서 시작하여 Android, iOS, 데스크톱, 웹에서 실행되는 기능적인 시간대 앱에 이르기까지, 필수 UI 구성 요소, 상태 관리, 리소스 처리를 다루며 Compose Multiplatform 앱을 처음부터 끝까지 구축하는 방법.
</td>
<td>
무료
</td>
<td>
2-3시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Create a Multiplatform App Using Ktor and SQLDelight](multiplatform-ktor-sqldelight.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
Ktor를 네트워킹에, SQLDelight를 로컬 데이터베이스에 사용하여 공유 데이터 레이어를 구축하고, 이를 Android의 Jetpack Compose 및 iOS의 SwiftUI로 구축된 네이티브 UI에 연결하는 방법.
</td>
<td>
무료
</td>
<td>
4-6시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Expected and Actual Declarations](multiplatform-expect-actual.md)

아티클

</td>
<td>
JetBrains
</td>

<td>
공통 코드에서 플랫폼별 API에 액세스하기 위한 핵심 expect/actual 메커니즘을 함수, 속성, 클래스 사용과 같은 다양한 전략과 함께 다룹니다.
</td>
<td>
무료
</td>
<td>
1-2시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Using Platform-Specific APIs in KMP Apps](https://www.youtube.com/watch?v=bSNumV04y_w)

영상 튜토리얼

</td>
<td>
JetBrains

YouTube
</td>

<td>
KMP 앱에서 플랫폼별 코드를 사용하는 모범 사례.
</td>
<td>
무료
</td>
<td>
15분
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[KMP for Android Developers](https://nsmirosh.gumroad.com/l/tmmqwa)

영상 강좌

</td>
<td>
Mykola Miroshnychenko

Gumroad
</td>

<td>
expect/actual 및 소스 세트와 같은 KMP 기본 사항을 마스터하여 기존 Android 개발 기술을 iOS로 확장하고, Ktor를 네트워킹에, Room을 데이터 영속성에 사용하는 현대적인 라이브러리로 완전한 앱 스택을 구축하는 방법.
</td>
<td>
유료 (약 $60)
</td>
<td>
8-12시간 (진행 중)
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform Masterclass](https://www.udemy.com/course/kotlin-multiplatform-masterclass/)

영상 강좌

</td>
<td>
Petros Efthymiou

Udemy
</td>

<td>
클린 아키텍처와 MVI를 처음부터 적용하여 완전한 KMP 애플리케이션을 구축하고, Ktor, SQLDelight, Koin과 같은 필수 라이브러리의 전체 스택을 네이티브 Jetpack Compose 및 SwiftUI UI와 통합하는 방법.
</td>
<td>
유료 (€10-20)
</td>
<td>
6시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Compose Multiplatform Full Course 2025 - Zero to Hero](https://www.youtube.com/watch?v=Z92zJzL-6z0&list=PL0pXjGnY7PORAoIX2q7YG2sotapCp4hyl)

영상 강좌

</td>
<td>
Code with FK

YouTube
</td>

<td>
Compose Multiplatform만으로 완전하고 기능이 풍부한 애플리케이션을 구축하고, 기본 사항부터 Firebase 인증, SQLDelight를 사용한 오프라인 지원, 실시간 업데이트와 같은 고급 실제 기능에 이르기까지 진행하는 방법.
</td>
<td>
무료
</td>
<td>
20시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform Development](https://www.linkedin.com/learning/kotlin-multiplatform-development)

영상 강좌

</td>
<td>
Colin Lee

LinkedIn Learning
</td>

<td>
Compose Multiplatform과 네이티브 UI 간의 아키텍처 선택, Swift 상호 운용성(interoperability)의 기본 사항 이해, 네트워킹, 영속성, 의존성 주입을 위한 필수 KMP 생태계에 대한 포괄적인 개요를 얻는 방법.
</td>
<td>
유료 (월 약 $30-40)
</td>
<td>
3시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform by Tutorials (3rd Edition)](https://www.kodeco.com/books/kotlin-multiplatform-by-tutorials/v3.0)

도서

</td>
<td>
Kodeco Team (Kevin D. Moore, Carlos Mota, Saeed Taheri)
</td>

<td>
네트워킹, 직렬화, 영속성을 위해 네이티브 UI를 KMP 공유 모듈에 연결하여 코드를 공유하는 기본 사항. 또한 의존성 주입, 테스트, 현대적인 아키텍처를 적용하여 유지보수 가능하고 확장 가능한 실제 앱을 구축하는 방법도 배웁니다.
</td>
<td>
유료 (약 $60)
</td>
<td>
40-60시간
</td>
</tr>

<!-- END OF BEGINNER BLOCK -->

<!-- INTERMEDIATE BLOCK -->

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Make your Android application work on iOS](multiplatform-integrate-in-existing-app.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
기존 Android 앱의 비즈니스 로직을 원본 Android 앱과 새로운 네이티브 iOS 프로젝트 모두에서 사용할 수 있는 공유 모듈로 추출하여 KMP로 마이그레이션하는 실용적인 단계.
</td>
<td>
무료
</td>
<td>
2시간
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Migrate Existing Apps to Room KMP (Google Codelab)](https://developer.android.com/codelabs/kmp-migrate-room)

튜토리얼

</td>
<td>
Google/ Android
</td>

<td>
기존 Android Room 데이터베이스를 공유 KMP 모듈로 마이그레이션하여 Android와 iOS 모두에서 익숙한 DAO 및 엔티티를 재사용하는 방법.
</td>
<td>
무료
</td>
<td>
2시간
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[How to Share ViewModels in Compose Multiplatform (with Dependency Injection!)](https://www.youtube.com/watch?v=O85qOS7U3XQ)

영상 튜토리얼

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
의존성 주입을 위해 Koin을 사용하여 Compose Multiplatform 프로젝트에서 공유 ViewModel을 구현하여 상태 관리 로직을 한 번만 작성하는 방법.
</td>
<td>
무료
</td>
<td>
30분
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[The Compose Multiplatform Crash Course 2025](https://www.youtube.com/watch?v=WT9-4DXUqsM)

영상 강좌

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
클린 아키텍처를 사용하여 완전하고 프로덕션 준비가 된 Book 앱을 처음부터 구축하고, 네트워킹을 위한 Ktor, 로컬 데이터베이스를 위한 Room, 의존성 주입을 위한 Koin, 멀티플랫폼 내비게이션을 포함한 현대적인 KMP 스택을 다루는 방법.
</td>
<td>
무료
</td>
<td>
5시간
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Building Industry-Level Multiplatform Apps With KMP](https://pl-coding.com/kmp/)

영상 강좌

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
네이티브 UI (Jetpack Compose & SwiftUI) 간에 ViewModel과 비즈니스 로직을 공유하여 실제 번역기 앱을 구축하고, 클린 아키텍처부터 양쪽 플랫폼의 단위, UI, 종단간 테스트에 이르는 전체 개발 수명 주기를 다루는 방법.
</td>
<td>
유료 (약 €99)
</td>
<td>
20시간
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Building Industry-Level Compose Multiplatform Android & iOS Apps](https://pl-coding.com/cmp-mobile)

영상 강좌

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
실시간 WebSockets를 위한 Ktor, 로컬 영속성을 위한 Room, 다중 모듈 의존성 주입을 위한 Koin을 포함한 완전한 Compose Multiplatform 스택을 사용하여 대규모 오프라인 우선(offline-first) 채팅 애플리케이션을 처음부터 구축하는 방법.
</td>
<td>
유료 (약 €199)
</td>
<td>
34시간
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Ultimate Compose Multiplatform: Android/iOS + Testing](https://www.udemy.com/course/ultimate-compose-multiplatform-androidios-testing-kotlin/)

영상 강좌

</td>
<td>
Hamidreza Sahraei

Udemy

</td>

<td>
Compose Multiplatform만으로 기능이 풍부한 가상 암호화폐 지갑 앱을 구축하고, 핵심 스택 (Ktor, Room, Koin)뿐만 아니라 견고한 단위/UI 테스트 및 생체 인식 인증과 같은 고급 플랫폼 통합을 다루는 방법.
</td>
<td>
유료 (약 €20)
</td>
<td>
8시간
</td>
</tr>
<!-- END OF INTERMEDIATE BLOCK -->

<!-- ADVANCED BLOCK -->

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Kotlin/Swift Interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)

아티클

</td>
<td>
JetBrains

GitHub
</td>

<td>
iOS (Obj-C/Swift)와의 상호 운용성(Interoperability), SKIE, KMP-NativeCoroutines, 언어 기능 격차 해소를 위한 해결책, Swift 내보내기, 양방향 상호 운용성.
</td>
<td>
무료
</td>
<td>
2시간
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Multi-Modular Ecommerce App for Android & iOS (KMP)](https://www.udemy.com/course/multi-modular-ecommerce-app-for-android-ios-kmp/)

영상 강좌

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
Figma UI로 전자상거래 앱을 설계하는 것부터 Compose Multiplatform을 사용하여 공유 UI로 완전한 다중 모듈 애플리케이션으로 구축하는 것, 그리고 인증, 데이터베이스 및 자동화된 Cloud Functions를 위해 Firebase 서비스를 사용하는 전체 백엔드를 생성하고 통합하는 것까지, 전체 제품 수명 주기.
</td>
<td>
유료 (약 €50)
</td>
<td>
30시간
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Exploring Ktor with Kotlin Multiplatform and Compose](https://www.linkedin.com/learning/exploring-ktor-with-kotlin-multiplatform-and-compose)

영상 강좌

</td>
<td>
Troy Miles

LinkedIn Learning
</td>

<td>
먼저 안전한 Ktor 백엔드를 생성하여 AWS에 배포하고, Kotlin Multiplatform을 사용하여 API를 사용하는 공유 코드로 네이티브 클라이언트를 구축함으로써 풀스택 Kotlin 애플리케이션을 구축하는 방법.
</td>
<td>
유료 (월 약 $30-40)
</td>
<td>
2-3시간
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Full-Stack Game Development - Kotlin & Compose Multiplatform](https://www.udemy.com/course/full-stack-game-development-kotlin-compose-multiplatform/)

영상 강좌

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
Compose Multiplatform으로 완전한 2D 게임을 구축하고, 물리, 충돌 감지, 스프라이트 시트 애니메이션을 다루며, Android, iOS, 데스크톱, 웹 (Kotlin/Wasm을 통해)에 배포하는 방법.
</td>
<td>
유료 (약 €99)
</td>
<td>
8-10시간
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Philipp Lackner Full-Stack Bundle: KMP + Spring Boot](https://pl-coding.com/full-stack-bundle)

영상 강좌

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
멀티 모듈 Spring Boot 백엔드 (WebSockets 포함)부터 오프라인 우선 Compose Multiplatform 클라이언트 (Android, iOS, 데스크톱, 웹) 및 전체 CI/CD 파이프라인에 이르기까지, 완전한 풀스택 채팅 애플리케이션을 설계, 구축 및 배포하는 방법.
</td>
<td>
유료 (약 €429)
</td>
<td>
55시간
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[KMP For Native Mobile Teams](https://touchlab.co/kmp-teams-intro)

아티클 시리즈

</td>
<td>
Touchlab
</td>

<td>
기존 네이티브 모바일 팀 내에서 KMP 도입 프로세스 전체를 탐색하는 방법: 초기 동의를 얻고 기술 파일럿을 실행하는 것부터 지속 가능한 실제 워크플로우를 통해 공유 코드베이스를 확장하는 것까지.
</td>
<td>
무료
</td>
<td>
6-8시간
</td>
</tr>

<!-- END OF ADVANCED BLOCK -->

<!-- LIB-AUTHORS BLOCK -->

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[API Guidelines for Multiplatform Library Building](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)

문서

</td>
<td>
JetBrains
</td>

<td>
코드 재사용을 극대화하고 광범위한 플랫폼 호환성을 보장하기 위한 필수 모범 사례를 따르면서 멀티플랫폼 라이브러리의 공개 API를 설계하는 방법.
</td>
<td>
무료
</td>
<td>
1-2시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Create Your Kotlin Multiplatform Library](create-kotlin-multiplatform-library.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
공식 스타터 템플릿을 사용하고, 로컬 Maven 게시를 설정하고, 라이브러리 구조를 구성하고, 게시를 설정하는 방법.
</td>
<td>
무료
</td>
<td>
2-3시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Documentation with Dokka](https://kotlinlang.org/docs/dokka-introduction.html)

문서/ GitHub

</td>
<td>
JetBrains
</td>

<td>
Dokka를 사용하여 혼합 Kotlin/Java 프로젝트를 지원하며, 여러 형식으로 KMP 라이브러리에 대한 전문적인 API 문서를 자동으로 생성하는 방법.
</td>
<td>
무료
</td>
<td>
2-3시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[KMP Library Template](https://github.com/Kotlin/multiplatform-library-template)

GitHub 템플릿

</td>
<td>
JetBrains

GitHub
</td>

<td>
빌드 설정 및 게시를 위한 모범 사례가 사전 구성된 공식 템플릿을 사용하여 새로운 KMP 라이브러리 프로젝트를 빠르게 부트스트랩하는 방법.
</td>
<td>
무료
</td>
<td>
1시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Publish to Maven Central](multiplatform-publish-libraries.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
자격 증명 설정, 게시 플러그인 구성, CI를 통한 프로세스 자동화를 포함하여 KMP 라이브러리를 Maven Central에 게시하는 완전한 단계별 프로세스.
</td>
<td>
무료
</td>
<td>
3-4시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatform Libraries](https://www.linkedin.com/learning/kotlin-multiplatform-libraries)

영상 강좌

</td>
<td>
LinkedIn Learning
</td>

<td>
효과적인 API 설계 및 코드 공유 전략부터 최종 배포 및 모범 사례에 이르기까지 KMP 라이브러리 생성의 전체 수명 주기.
</td>
<td>
유료 (월 약 $30-40)
</td>
<td>
2-3시간
</td>
</tr>

<!-- END OF LIB-AUTHORS BLOCK -->

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem id="beginner" title="🌱 초급">

<include element-id="source" use-filter="empty,beginner" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="intermediate" title="🌿 중급">

<include element-id="source" use-filter="empty,intermediate" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="advanced" title="🌳 고급">

<include element-id="source" use-filter="empty,advanced" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="lib-authors" title="🧩 라이브러리 개발자">

<include element-id="source" use-filter="empty,lib-authors" from="kmp-learning-resources.md"/>

</TabItem>

</Tabs>