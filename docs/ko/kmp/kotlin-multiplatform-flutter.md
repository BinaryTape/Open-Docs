# Kotlin Multiplatform과 Flutter: 크로스 플랫폼 개발 솔루션

<web-summary>이 글에서는 Kotlin Multiplatform과 Flutter를 탐색하여, 이들의 기능 이해를 돕고 크로스 플랫폼 프로젝트에 적합한 솔루션을 선택하는 데 도움을 드립니다.</web-summary> 

급변하는 기술 세계에서 개발자들은 고품질 애플리케이션을 구축하는 데 도움이 되는 효율적인 프레임워크와 도구를 끊임없이 찾고 있습니다. 그러나 사용 가능한 여러 옵션 중에서 선택할 때, 이른바 '최고의 옵션'을 찾는 데 너무 많은 강조를 두는 것은 피해야 합니다. 이러한 접근 방식이 항상 가장 적합한 선택으로 이어지지는 않을 수 있기 때문입니다.

각 프로젝트는 고유하며 특정 요구 사항을 가지고 있습니다. 이 글은 선택을 안내하고 Kotlin Multiplatform 또는 Flutter와 같은 어떤 기술이 귀하의 프로젝트에 가장 적합한지 더 잘 이해하여 정보에 입각한 결정을 내릴 수 있도록 돕는 것을 목표로 합니다.

## 크로스 플랫폼 개발: 현대적인 애플리케이션 구축을 위한 통합 접근 방식

크로스 플랫폼 개발은 단일 코드베이스로 여러 플랫폼에서 실행되는 애플리케이션을 구축하는 방법을 제공하여, 각 시스템에 동일한 기능을 다시 작성할 필요를 없앱니다. 일반적으로 [모바일 개발](cross-platform-mobile-development.md)과 관련되어 Android와 iOS를 모두 대상으로 하지만, 이 접근 방식은 모바일을 넘어 웹, 데스크톱, 심지어 서버 측 환경까지 확장됩니다.

핵심 아이디어는 코드 재사용을 극대화하면서 필요할 때 플랫폼별 기능을 여전히 구현할 수 있도록 보장하여, 개발 프로세스를 간소화하고 유지보수 노력을 줄이는 것입니다. 팀은 개발 주기를 단축하고 비용을 절감하며 플랫폼 전반에 걸쳐 일관성을 보장할 수 있으므로, 크로스 플랫폼 개발은 오늘날 점점 더 다양해지는 애플리케이션 환경에서 현명한 선택입니다.

## Kotlin Multiplatform과 Flutter: 플랫폼 전반의 개발 간소화

Flutter와 Kotlin Multiplatform은 여러 플랫폼에서 애플리케이션 개발을 간소화하는 두 가지 인기 있는 크로스 플랫폼 기술입니다.

### Flutter

[Flutter](https://flutter.dev/)는 단일 코드베이스로 네이티브 컴파일되는 멀티플랫폼 애플리케이션을 구축하기 위한 오픈 소스 프레임워크입니다. Android, iOS, 웹, 데스크톱 (Windows, macOS, Linux), 임베디드 시스템 전반에 걸쳐 풍부한 앱 경험을 생성할 수 있습니다. 이 모든 것이 단일의 공유 앱 코드베이스에서 이루어집니다. Flutter 앱은 Dart 프로그래밍 언어를 사용하여 작성됩니다. Flutter는 Google에서 지원하고 사용합니다.

2014년 Sky라는 이름으로 처음 소개되었으며, [Flutter 1.0](https://developers.googleblog.com/en/flutter-10-googles-portable-ui-toolkit/)은 2018년 12월 Flutter Live에서 공식적으로 발표되었습니다.

Flutter 개발자 커뮤니티는 크고 매우 활발하며, 지속적인 개선과 지원을 제공합니다. Flutter는 Flutter 및 Dart 생태계 내에서 개발자들이 기여한 공유 패키지를 사용할 수 있도록 합니다.

### Kotlin Multiplatform

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP)는 JetBrains가 구축한 오픈 소스 기술로, 개발자가 Android, iOS, 웹, 데스크톱 (Windows, macOS, Linux), 서버 측 애플리케이션을 생성할 수 있도록 하여, 네이티브 프로그래밍의 이점을 유지하면서 이러한 플랫폼 전반에 걸쳐 Kotlin 코드를 효율적으로 재사용할 수 있게 합니다.

Kotlin Multiplatform을 사용하면 다양한 옵션을 선택할 수 있습니다. 앱 진입점을 제외한 모든 코드를 공유하거나, (네트워크 또는 데이터베이스 모듈과 같은) 단일 로직을 공유하거나, UI는 네이티브로 유지하면서 비즈니스 로직을 공유할 수 있습니다.

![Kotlin Multiplatform은 코드의 최대 100%를 재사용하기 위한 기술입니다.](kmp-logic-and-ui.svg){ width="700" }

Kotlin Multiplatform은 2017년 Kotlin 1.2의 일부로 처음 소개되었습니다. 2023년 11월, Kotlin Multiplatform은 안정화되었습니다. Google I/O 2024에서 Google은 Android와 iOS 간의 비즈니스 로직 공유를 위한 [Kotlin Multiplatform 지원](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)을 발표했습니다.

Kotlin Multiplatform의 전반적인 방향에 대해 더 자세히 알고 싶다면, 저희 블로그 게시물 [What’s Next for Kotlin Multiplatform and Compose Multiplatform](https://blog.jetbrains.com/kotlin/2025/08/kmp-roadmap-aug-2025/)을 살펴보세요.

[![Discover Kotlin Multiplatform](discover-kmp.svg){width="500"}](https://www.jetbrains.com/kotlin-multiplatform/)

#### Compose Multiplatform

JetBrains의 최신 선언형 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)을 사용하여 여러 플랫폼에 걸쳐 공유 UI 코드를 작성할 수 있습니다. 이는 Kotlin Multiplatform과 Google의 Jetpack Compose를 기반으로 구축되었습니다.

Compose Multiplatform은 현재 [iOS](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/), Android 및 데스크톱에서 안정화되었으며, 웹에서는 베타(Beta) 버전입니다.

[![Explore Compose Multiplatform](explore-compose.svg){width="500"}](https://www.jetbrains.com/compose-multiplatform/)

저희 전용 글에서는 [Compose Multiplatform과 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md)의 관계를 설명하고 주요 차이점을 강조합니다.

### Kotlin Multiplatform과 Flutter: 개요

<table style="both">
    
<tr>
<td></td>
        <td><b>Kotlin Multiplatform</b></td>
        <td><b>Flutter</b></td>
</tr>

    
<tr>
<td><b>제작자</b></td>
        <td>JetBrains</td>
        <td>Google</td>
</tr>

    
<tr>
<td><b>언어</b></td>
        <td>Kotlin</td>
        <td>Dart</td>
</tr>

    
<tr>
<td><b>유연성 및 코드 재사용</b></td>
        <td>비즈니스 로직 및/또는 UI를 포함하여 코드베이스의 원하는 부분을 1%부터 100%까지 공유할 수 있습니다.</td>
        <td>애플리케이션의 모든 픽셀을 제어하여 맞춤형 및 반응형 디자인을 생성하기 위해 모든 플랫폼에서 100% 코드를 공유할 수 있습니다.</td>
</tr>

    
<tr>
<td><b>패키지, 종속성 및 생태계</b></td>
        <td>패키지는 <a href="https://central.sonatype.com/">Maven Central</a> 및 다음을 포함한 다른 저장소에서 사용할 수 있습니다.
            <p><a href="http://klibs.io">klibs.io</a> (Alpha version)는 KMP 라이브러리 검색을 간소화하기 위해 설계되었습니다.</p>
            <p>이 <a href="https://github.com/terrakok/kmp-awesome">목록</a>에는 가장 인기 있는 KMP 라이브러리 및 도구 중 일부가 포함되어 있습니다.</p> </td>
        <td>패키지는 <a href="https://pub.dev/">Pub.dev</a>에서 사용할 수 있습니다.</td>
</tr>

    
<tr>
<td><b>빌드 도구</b></td>
        <td>Gradle (Apple 기기 대상 애플리케이션의 경우 Xcode 추가).</td>
        <td>Flutter 명령줄 도구 (내부적으로 Gradle 및 Xcode 사용).</td>
</tr>

    
<tr>
<td><b>코드 공유</b></td>
        <td>Android, iOS, 웹, 데스크톱, 서버 측.</td>
        <td>Android, iOS, 웹, 데스크톱, 임베디드 기기.</td>
</tr>

    
<tr>
<td><b>컴파일</b></td>
        <td>데스크톱 및 Android용 JVM 바이트코드, 웹용 JavaScript 또는 Wasm, 네이티브 플랫폼용 플랫폼별 바이너리로 컴파일됩니다.</td>
        <td>디버그 빌드는 가상 머신에서 Dart 코드를 실행합니다.
        <p>릴리스 빌드는 네이티브 플랫폼용 플랫폼별 바이너리, 웹용 JavaScript/Wasm을 출력합니다.</p>
        </td>
</tr>

    
<tr>
<td><b>네이티브 API와의 통신</b></td>
        <td>네이티브 API는 <Links href="/kmp/multiplatform-expect-actual" summary="undefined">`expect/actual` 선언</Links>을 사용하여 Kotlin 코드에서 직접 접근할 수 있습니다.</td>
        <td>호스트 플랫폼과의 통신은 <a href="https://docs.flutter.dev/platform-integration/platform-channels">플랫폼 채널</a>을 사용하여 가능합니다.</td>
</tr>

    
<tr>
<td><b>UI 렌더링</b></td>
        <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a>은 Google의 Jetpack Compose를 기반으로 Skia 엔진을 사용하여 플랫폼 전반에 걸쳐 UI를 공유하는 데 사용될 수 있습니다. Skia 엔진은 OpenGL, ANGLE (OpenGL ES 2 또는 3 호출을 네이티브 API로 변환), Vulkan, Metal과 호환됩니다.</td>
        <td>Flutter 위젯은 사용자 정의 <a href="https://docs.flutter.dev/perf/impeller">Impeller 엔진</a>을 사용하여 화면에 렌더링됩니다. Impeller 엔진은 플랫폼 및 기기에 따라 Metal, Vulkan 또는 OpenGL을 사용하여 GPU와 직접 통신합니다.</td>
</tr>

    
<tr>
<td><b>UI 개발 반복</b></td>
        <td>공통 코드에서도 UI 미리보기를 사용할 수 있습니다.
        <p><Links href="/kmp/compose-hot-reload" summary="undefined">Compose Hot Reload</Links>를 사용하면 앱을 다시 시작하거나 상태를 잃지 않고도 UI 변경 사항을 즉시 확인할 수 있습니다.</p></td>
        <td>VS Code 및 Android Studio용 IDE 플러그인을 사용할 수 있습니다.</td>
</tr>

    
<tr>
<td><b>기술을 사용하는 회사</b></td>
        <td><a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>, <a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>, <a href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald’s</a>, <a href="https://www.youtube.com/watch?v=5sOXv-X43vc">Google Workspace</a>, <a href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>, <a href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>, <a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>, <a href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>, <a href="https://touchlab.co/">TouchLab</a>, <a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a>, 그리고 더 많은 회사가 저희 <a href="https://kotlinlang.org/case-studies/?type=multiplatform">KMP 사례 연구</a>에 나열되어 있습니다.</td>
        <td><a href="https://flutter.dev/showcase/xiaomi">Xiaomi</a>, <a href="https://flutter.dev/showcase/wolt">Wolt</a>, <a href="https://flutter.dev/showcase/universal-studios">Universal Studios</a>, <a href="https://flutter.dev/showcase/alibaba-group">Alibaba Group</a>, <a href="https://flutter.dev/showcase/bytedance">ByteDance</a>, <a href="https://www.geico.com/techblog/flutter-as-the-multi-channel-ux-framework/">Geico</a>, <a href="https://flutter.dev/showcase/ebay">eBay Motors</a>, <a href="https://flutter.dev/showcase/google-pay">Google Pay</a>, <a href="https://flutter.dev/showcase/so-vegan">So Vegan</a>, 그리고 더 많은 회사가 <a href="https://flutter.dev/showcase">Flutter 쇼케이스</a>에 나열되어 있습니다.</td>
</tr>

</table>

[![Kotlin Multiplatform을 활용하여 크로스 플랫폼 개발을 수행하는 글로벌 기업의 실제 사용 사례를 살펴보세요.](kmp-use-cases-1.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

또한 Google의 블로그 게시물인 [개발자를 위한 플랫폼 간 개발 간소화](https://developers.googleblog.com/en/making-development-across-platforms-easier-for-developers/)를 확인하여 프로젝트에 적합한 기술 스택을 선택하는 데 대한 지침을 얻을 수 있습니다.

Kotlin Multiplatform과 Flutter 간의 추가 비교를 원한다면, Philipp Lackner의 [KMP vs. Flutter 영상](https://www.youtube.com/watch?v=dzog64ENKG0)을 시청할 수도 있습니다. 이 영상에서 그는 코드 공유, UI 렌더링, 성능, 그리고 두 기술의 미래 측면에서 이 기술들에 대한 흥미로운 관찰을 공유합니다.

귀하의 특정 비즈니스 요구 사항, 목표 및 작업을 신중하게 평가함으로써 귀하의 요구 사항을 가장 잘 충족하는 크로스 플랫폼 솔루션을 식별할 수 있습니다.