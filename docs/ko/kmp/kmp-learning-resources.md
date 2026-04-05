[//]: # (title: 학습 리소스)

<web-summary>KMP 경험 수준에 가장 적합한 학습 자료를 선택하세요.</web-summary>

30개 이상의 필수적인 Kotlin Multiplatform (KMP) 및 Compose Multiplatform 학습 자료를 모았습니다. 숙련도별로 분류된 튜토리얼, 강의, 아티클 중에서 본인의 경험에 맞는 자료를 찾아보세요:

🌱 **입문자 (Beginner)**. JetBrains와 Google의 공식 튜토리얼을 통해 KMP와 Compose의 기초를 배웁니다. Room, Ktor, SQLDelight와 같은 핵심 라이브러리를 사용하여 간단한 앱을 제작합니다.

🌿 **중급자 (Intermediate)**. 공유 ViewModel, Koin 기반 의존성 주입(dependency injection), 클린 아키텍처(clean architecture)를 활용해 실무 앱을 개발합니다. JetBrains와 커뮤니티 교육 전문가들의 강의를 통해 학습합니다.

🌳 **숙련자 (Advanced)**. 백엔드 및 게임 개발을 위한 풀스케일 KMP 엔지니어링으로 나아가며, 대규모 멀티 팀 프로젝트를 위한 아키텍처 확장 및 도입 가이드를 학습합니다.

🧩 **라이브러리 제작자 (Library authors)**. 재사용 가능한 KMP 라이브러리를 제작하고 배포합니다. 공식 JetBrains 도구와 템플릿을 사용하여 API 디자인, Dokka 문서화, Maven 배포를 배웁니다.

<Tabs>
<TabItem id="all-resources" title="전체">

<snippet id="source">
<table>

<!-- BEGINNER BLOCK -->
<thead>

<tr>
<th>

**🎚**

</th>
<th>

**리소스 /**

**유형**

</th>
<th>

**제작자 /**
**플랫폼**

</th>

<th>

**학습 내용**

</th>
<th>

**가격**

</th>
<th>

**예상 소요 시간**

</th>
</tr>

</thead>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform 개요](kmp-overview.md)

아티클

</td>
<td>
JetBrains
</td>

<td>
KMP의 핵심 가치, 실제 사용 사례 및 적절한 학습 경로 선택에 대한 가이드를 제공합니다.
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

[첫 번째 KMP 앱 만들기](multiplatform-create-first-app.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
KMP 프로젝트를 설정하고, UI는 완전히 네이티브로 유지하면서 Android와 iOS 간에 간단한 비즈니스 로직을 공유하는 방법을 배웁니다.
</td>
<td>
무료
</td>
<td>
1–2시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform 시작하기 (Google 코드랩)](https://developer.android.com/codelabs/kmp-get-started)

튜토리얼

</td>
<td>
Google

Android
</td>

<td>
기존 Android 프로젝트에 공유 KMP 모듈을 추가하고, SKIE 플러그인을 사용하여 Kotlin 코드에서 관용적인(idiomatic) Swift API를 생성하여 iOS와 통합하는 방법을 배웁니다.
</td>
<td>
무료
</td>
<td>
1–2시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[첫 번째 Compose Multiplatform 앱 만들기](compose-multiplatform-create-first-app.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
기본 템플릿에서 시작하여 Android, iOS, 데스크톱 및 웹에서 실행되는 기능적인 시간대(time zone) 앱으로 발전시켜 나가며, 필수 UI 구성 요소, 상태 관리 및 리소스 처리를 포함한 완전한 Compose Multiplatform 앱을 처음부터 구축하는 방법을 배웁니다.
</td>
<td>
무료
</td>
<td>
2–3시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Ktor 및 SQLDelight를 사용한 멀티플랫폼 앱 만들기](multiplatform-ktor-sqldelight.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
네트워킹을 위한 Ktor와 로컬 데이터베이스를 위한 SQLDelight를 사용하여 공유 데이터 레이어를 구축하고, 이를 Android의 Jetpack Compose 및 iOS의 SwiftUI로 빌드된 네이티브 UI에 연결하는 방법을 배웁니다.
</td>
<td>
무료
</td>
<td>
4–6시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Expected 및 Actual 선언](multiplatform-expect-actual.md)

아티클

</td>
<td>
JetBrains
</td>

<td>
함수, 프로퍼티, 클래스 사용과 같은 다양한 전략을 다루며, 공통 코드에서 플랫폼별 API에 접근하기 위한 핵심 메커니즘인 expect/actual에 대해 알아봅니다.
</td>
<td>
무료
</td>
<td>
1–2시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[KMP 앱에서 플랫폼별 API 사용하기](https://www.youtube.com/watch?v=bSNumV04y_w)

비디오 튜토리얼

</td>
<td>
JetBrains

YouTube
</td>

<td>
KMP 앱에서 플랫폼별 코드를 사용하기 위한 베스트 프랙티스를 배웁니다.
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

[Android 개발자를 위한 KMP](https://nsmirosh.gumroad.com/l/tmmqwa)

비디오 강의

</td>
<td>
Mykola Miroshnychenko

Gumroad
</td>

<td>
expect/actual 및 소스 세트와 같은 KMP 기초를 마스터하여 기존 Android 개발 기술을 iOS로 확장하는 방법과 네트워킹을 위한 Ktor, 영속성을 위한 Room과 같은 현대적인 라이브러리를 사용하여 전체 앱 스택을 구축하는 방법을 배웁니다.
</td>
<td>
약 $60
</td>
<td>
8–12시간
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform 마스터클래스](https://www.udemy.com/course/kotlin-multiplatform-masterclass/)

비디오 강의

</td>
<td>
Petros Efthymiou

Udemy
</td>

<td>
클린 아키텍처와 MVI를 처음부터 적용하여 완전한 KMP 애플리케이션을 구축하고, Ktor, SQLDelight, Koin 등 필수 라이브러리 스택을 네이티브 Jetpack Compose 및 SwiftUI UI와 통합하는 방법을 배웁니다.
</td>
<td>
€10–€20
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

[Compose Multiplatform 전체 과정 2025 | Zero to Hero](https://www.youtube.com/watch?v=Z92zJzL-6z0&list=PL0pXjGnY7PORAoIX2q7YG2sotapCp4hyl)

비디오 강의

</td>
<td>
Code with FK

YouTube
</td>

<td>
기초부터 시작하여 Firebase 인증, SQLDelight를 사용한 오프라인 지원, 실시간 업데이트와 같은 고급 실무 기능까지 발전시켜 나가며, 오직 Compose Multiplatform만으로 기능이 풍부한 완전한 애플리케이션을 구축하는 방법을 배웁니다.
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

[Kotlin Multiplatform 개발](https://www.linkedin.com/learning/kotlin-multiplatform-development)

비디오 강의

</td>
<td>
Colin Lee

LinkedIn Learning
</td>

<td>
Compose Multiplatform과 네이티브 UI 사이의 아키텍처 선택, Swift 상호운용성(interoperability)의 기초, 네트워킹, 영속성 및 의존성 주입을 위한 필수 KMP 생태계에 대한 포괄적인 개요를 학습합니다.
</td>
<td>
약 $30–$40/월
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

[Kotlin Multiplatform by Tutorials (제3판)](https://www.kodeco.com/books/kotlin-multiplatform-by-tutorials/v3.0)

도서

</td>
<td>
Kodeco Team (Kevin D. Moore, Carlos Mota, Saeed Taheri)
</td>

<td>
네이티브 UI를 네트워킹, 직렬화(serialization) 및 영속성을 위한 KMP 공유 모듈에 연결하여 코드를 공유하는 기초를 배웁니다. 또한 의존성 주입, 테스트 및 현대적인 아키텍처를 적용하여 유지 관리와 확장이 용이한 실무 앱을 구축하는 방법을 확인합니다.
</td>
<td>
약 $60
</td>
<td>
40–60시간
</td>
</tr>

<!-- END OF BEGINNER BLOCK -->

<!-- INTERMEDIATE BLOCK -->

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Android 애플리케이션을 iOS에서 작동하게 만들기](multiplatform-integrate-in-existing-app.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
기존 Android 앱의 비즈니스 로직을 추출하여 원래의 Android 앱과 새로운 네이티브 iOS 프로젝트 모두에서 사용할 수 있는 공유 모듈로 옮김으로써 KMP로 마이그레이션하는 실질적인 단계를 배웁니다.
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

[기존 앱을 Room KMP로 마이그레이션하기 (Google 코드랩)](https://developer.android.com/codelabs/kmp-migrate-room)

튜토리얼

</td>
<td>
Google

Android
</td>

<td>
기존 Android Room 데이터베이스를 공유 KMP 모듈로 마이그레이션하여, Android와 iOS 모두에서 익숙한 DAO 및 엔티티를 재사용하는 방법을 배웁니다.
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

[Compose Multiplatform에서 ViewModel 공유하는 방법 (의존성 주입 포함!)](https://www.youtube.com/watch?v=O85qOS7U3XQ)

비디오 튜토리얼

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
Compose Multiplatform 프로젝트에서 의존성 주입을 위해 Koin을 사용하여 공유 ViewModel을 구현함으로써 상태 관리 로직을 한 번만 작성하는 방법을 배웁니다.
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

[Compose Multiplatform 집중 과정 2025](https://www.youtube.com/watch?v=WT9-4DXUqsM)

비디오 강의

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
클린 아키텍처를 사용하여 처음부터 프로덕션 수준의 도서 읽기 앱을 구축하는 방법을 배웁니다. 네트워킹을 위한 Ktor, 로컬 데이터베이스를 위한 Room, 의존성 주입을 위한 Koin, 멀티플랫폼 네비게이션을 포함한 현대적인 KMP 스택을 다룹니다.
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

[KMP로 산업 수준의 멀티플랫폼 앱 구축하기](https://pl-coding.com/kmp/)

비디오 강의

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
네이티브 UI(Jetpack Compose 및 SwiftUI) 간에 ViewModel과 비즈니스 로직을 공유하여 실제 번역기 앱을 구축하는 방법을 배웁니다. 클린 아키텍처부터 두 플랫폼에 대한 유닛, UI 및 엔드 투 엔드(E2E) 테스트까지 전체 개발 라이프사이클을 다룹니다.
</td>
<td>
약 €99
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

[산업 수준의 Compose Multiplatform Android 및 iOS 앱 구축하기](https://pl-coding.com/cmp-mobile)

비디오 강의

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
실시간 WebSocket을 위한 Ktor, 로컬 영속성을 위한 Room, 멀티 모듈 의존성 주입을 위한 Koin을 포함한 완전한 Compose Multiplatform 스택을 사용하여, 대규모 오프라인 우선(offline-first) 채팅 애플리케이션을 처음부터 구축하는 방법을 배웁니다.
</td>
<td>
약 €199
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

[궁극의 Compose Multiplatform: Android/iOS 및 테스트](https://www.udemy.com/course/ultimate-compose-multiplatform-androidios-testing-kotlin/)

비디오 강의

</td>
<td>
Hamidreza Sahraei

Udemy

</td>

<td>
오직 Compose Multiplatform만으로 기능이 풍부한 가상 암호화폐 지갑 앱을 구축하는 방법을 배웁니다. 핵심 스택(Ktor, Room, Koin)뿐만 아니라 강력한 유닛/UI 테스트와 생체 인증과 같은 고급 플랫폼 통합까지 다룹니다.
</td>
<td>
약 €20
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
iOS(Obj-C/Swift)와의 상호운용성, SKIE, KMP-NativeCoroutines, 언어 기능 차이에 대한 해결 방법, Swift 익스포트 및 양방향 상호운용성을 다룹니다.
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

[Android 및 iOS용 멀티 모듈 이커머스 앱 (KMP)](https://www.udemy.com/course/multi-modular-ecommerce-app-for-android-ios-kmp/)

비디오 강의

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
Figma에서 이커머스 앱의 UI를 디자인하는 것부터 Compose Multiplatform을 사용하여 공유 UI를 갖춘 완전한 멀티 모듈 애플리케이션으로 빌드하는 과정, 그리고 인증, 데이터베이스 및 자동화된 클라우드 함수를 위해 Firebase 서비스를 사용하여 전체 백엔드를 생성하고 통합하는 것까지 전체 제품 라이프사이클을 배웁니다.
</td>
<td>
약 €50
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

[Kotlin Multiplatform 및 Compose와 함께 Ktor 탐구하기](https://www.linkedin.com/learning/exploring-ktor-with-kotlin-multiplatform-and-compose)

비디오 강의

</td>
<td>
Troy Miles

LinkedIn Learning
</td>

<td>
먼저 AWS에 안전한 Ktor 백엔드를 생성하고 배포한 다음, Kotlin Multiplatform을 사용하여 API를 사용하는 공유 코드가 포함된 네이티브 클라이언트를 빌드하여 풀스택 Kotlin 애플리케이션을 구축하는 방법을 배웁니다.
</td>
<td>
약 $30–$40/월
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

[풀스택 게임 개발 - Kotlin 및 Compose Multiplatform](https://www.udemy.com/course/full-stack-game-development-kotlin-compose-multiplatform/)

비디오 강의

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
물리 엔진, 충돌 감지, 스프라이트 시트 애니메이션을 포함하여 Compose Multiplatform으로 완전한 2D 게임을 구축하는 방법과 이를 Android, iOS, 데스크톱 및 웹(Kotlin/Wasm 기반)에 배포하는 방법을 배웁니다.
</td>
<td>
약 €99
</td>
<td>
8–10시간
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Philipp Lackner 풀스택 번들: KMP 및 Spring Boot](https://pl-coding.com/full-stack-bundle)

비디오 강의

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
WebSocket을 포함한 멀티 모듈 Spring Boot 백엔드부터 오프라인 우선(offline-first) Compose Multiplatform 클라이언트(Android, iOS, 데스크톱, 웹) 및 전체 CI/CD 파이프라인에 이르기까지, 완전한 풀스택 채팅 애플리케이션을 설계, 구축 및 배포하는 방법을 배웁니다.
</td>
<td>
약 €429
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

[네이티브 모바일 팀을 위한 KMP](https://touchlab.co/kmp-teams-intro)

아티클 시리즈

</td>
<td>
Touchlab
</td>

<td>
초기 동의를 얻고 기술 파일럿을 실행하는 것부터 지속 가능한 실무 워크플로를 통해 공유 코드베이스를 확장하는 것까지, 기존 네이티브 모바일 팀 내에서 전체 KMP 도입 프로세스를 탐색하는 방법을 배웁니다.
</td>
<td>
무료
</td>
<td>
6–8시간
</td>
</tr>

<!-- END OF ADVANCED BLOCK -->

<!-- LIB-AUTHORS BLOCK -->

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[멀티플랫폼 라이브러리 구축을 위한 API 가이드라인](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)

문서

</td>
<td>
JetBrains
</td>

<td>
코드 재사용을 극대화하고 광범위한 플랫폼 호환성을 보장하기 위한 필수 베스트 프랙티스에 따라 멀티플랫폼 라이브러리의 공개 API를 설계하는 방법을 배웁니다.
</td>
<td>
무료
</td>
<td>
1–2시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatform 라이브러리 만들기](create-kotlin-multiplatform-library.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
공식 스타터 템플릿을 사용하고, 로컬 Maven 배포를 설정하며, 라이브러리를 구조화하고 배포를 구성하는 방법을 배웁니다.
</td>
<td>
무료
</td>
<td>
2–3시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Dokka를 이용한 문서화](https://kotlinlang.org/docs/dokka-introduction.html)

문서

</td>
<td>
JetBrains
</td>

<td>
Dokka를 사용하여 Kotlin/Java 혼합 프로젝트를 지원하며, KMP 라이브러리에 대한 전문적인 API 문서를 다양한 형식으로 자동 생성하는 방법을 배웁니다.
</td>
<td>
무료
</td>
<td>
2–3시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[KMP 라이브러리 템플릿](https://github.com/Kotlin/multiplatform-library-template)

GitHub 템플릿

</td>
<td>
JetBrains

GitHub
</td>

<td>
빌드 설정 및 배포에 대한 베스트 프랙티스가 사전 구성된 공식 템플릿을 사용하여 새로운 KMP 라이브러리 프로젝트를 신속하게 부트스트랩하는 방법을 배웁니다.
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

[Maven Central에 배포하기](multiplatform-publish-libraries-to-maven.md)

튜토리얼

</td>
<td>
JetBrains
</td>

<td>
자격 증명 설정, 배포 플러그인 구성, CI를 통한 프로세스 자동화를 포함하여 KMP 라이브러리를 Maven Central에 배포하는 전체 과정을 단계별로 배웁니다.
</td>
<td>
무료
</td>
<td>
3–4시간
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatform 라이브러리](https://www.linkedin.com/learning/kotlin-multiplatform-libraries)

비디오 강의

</td>
<td>
LinkedIn Learning
</td>

<td>
효과적인 API 디자인과 코드 공유 전략부터 최종 배포 및 베스트 프랙티스까지, KMP 라이브러리 제작의 전체 라이프사이클을 배웁니다.
</td>
<td>
약 $30–$40/월
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

<TabItem id="beginner" title="🌱 입문자">

<include element-id="source" use-filter="empty,beginner" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="intermediate" title="🌿 중급자">

<include element-id="source" use-filter="empty,intermediate" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="advanced" title="🌳 숙련자">

<include element-id="source" use-filter="empty,advanced" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="lib-authors" title="🧩 라이브러리 제작자">

<include element-id="source" use-filter="empty,lib-authors" from="kmp-learning-resources.md"/>

</TabItem>

</Tabs>