```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="kotlin-multiplatform-react-native"
       title="Kotlin Multiplatform vs. React Native: 크로스 플랫폼 비교">
<include-in-head>
<![CDATA[
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "Q: Kotlin Multiplatform은 프로덕션에 사용할 준비가 되었나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kotlin Multiplatform은 프로덕션에서 사용할 준비가 된 안정적인 기술입니다. 이는 가장 보수적인 사용 시나리오에서도 Android, iOS, 데스크톱 (JVM), 서버 측 (JVM) 및 웹 전반에서 코드를 공유하는 데 Kotlin Multiplatform을 사용할 수 있음을 의미합니다. Compose Multiplatform, 여러 플랫폼에서 공유 UI를 구축하기 위한 프레임워크 (Kotlin Multiplatform 및 Google의 Jetpack Compose 기반)는 iOS, Android, 데스크톱에서 안정적입니다. 웹 지원은 현재 베타 단계입니다. Kotlin Multiplatform의 전반적인 방향에 대해 더 자세히 알아보려면, 저희 블로그 게시물인 <a href=\"https://blog.jetbrains.com/kotlin/2025/08/kmp-roadmap-aug-2025/\">Kotlin Multiplatform 및 Compose Multiplatform의 다음 단계</a>를 확인하세요."
            }
          }, {
            "@type": "Question",
            "name": "Q: Kotlin Multiplatform이 React Native보다 좋나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kotlin Multiplatform과 React Native는 모두 고유한 강점을 가지고 있으며, 선택은 프로젝트의 특정 목표, 기술 요구사항 및 팀 전문성에 따라 달라집니다. 위 비교에서는 코드 공유, 빌드 도구, 컴파일 및 생태계와 같은 주요 차이점을 설명하여 사용 사례에 가장 적합한 옵션을 결정하는 데 도움을 드렸습니다."
            }
          }, {
            "@type": "Question",
            "name": "Q: Google은 Kotlin Multiplatform을 지원하나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Google I/O 2024에서 Google은 Android와 iOS 간의 비즈니스 로직 공유를 위해 Android에서 Kotlin Multiplatform 사용에 대한 공식 지원을 발표했습니다."
            }
          }, {
            "@type": "Question",
            "name": "Q: Kotlin Multiplatform을 배울 가치가 있나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "네이티브 성능과 유연성을 유지하면서 Android, iOS, 데스크톱 및 웹 전반에서 코드를 공유하는 데 관심이 있다면 Kotlin Multiplatform은 배울 가치가 있습니다. JetBrains의 지원을 받고 있으며, Android에서 Android와 iOS 간의 비즈니스 로직을 공유하는 데 Google의 공식 지원을 받습니다. 또한, Compose Multiplatform과 함께하는 KMP는 다중 플랫폼 앱을 구축하는 기업에서 프로덕션에 점점 더 많이 채택되고 있습니다."
            }
          }]
        }
        </script>
]]>
</include-in-head>
<web-summary>Kotlin Multiplatform과 Compose Multiplatform이 React Native와 코드 공유, 생태계, UI 렌더링 측면에서 어떻게 비교되는지 살펴보세요. 어떤 도구 스택이 팀에 가장 적합한지 알아보세요.
    </web-summary>
<tip>
    <p>이 비교 기사는 Kotlin Multiplatform이 플랫폼 API에 대한 완전한 접근 권한으로 Android 및 iOS 전반에 걸쳐 진정한 네이티브 경험을 제공하는 데 탁월하다는 점을 강조합니다.
        KMP는 특히 공유 UI 코드에 Compose Multiplatform을 사용할 때 성능, 유지보수성, 네이티브한 외관 및 느낌에 중점을 두는 팀에 특히 매력적입니다.
        반면에 React Native는 JavaScript 전문 지식을 가진 팀, 특히 빠른 프로토타이핑에 적합할 수 있습니다.</p>
</tip>
<p>크로스 플랫폼 개발은 팀이 애플리케이션을 구축하는 방식을 크게 변화시켰으며, 공유 코드베이스에서 여러 플랫폼용 앱을 제공할 수 있게 했습니다. 이 접근 방식은 개발을 간소화하고 기기 전반에 걸쳐 더욱 일관된 사용자 경험을 보장하는 데 도움이 됩니다.</p>
<p>이전에는 Android와 iOS용 앱을 구축하는 것이 종종 다른 팀에 의해 두 개의 개별 코드베이스를 유지하는 것을 의미했으며, 이는 작업 중복과 플랫폼 간의 눈에 띄는 차이로 이어졌습니다. 크로스 플랫폼 솔루션은 시장 출시 시간을 단축하고 전반적인 효율성을 향상시켰습니다.</p>
<p>사용 가능한 도구 중 Kotlin Multiplatform, React Native, Flutter는 가장 널리 채택된 세 가지 옵션으로 손꼽힙니다. 이 문서에서는 제품 및 팀에 적합한 옵션을 선택하는 데 도움이 되도록 이들을 자세히 살펴보겠습니다.</p>
<chapter title="Kotlin Multiplatform 및 Compose Multiplatform" id="kotlin-multiplatform-and-compose-multiplatform">
    <p><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform (KMP)</a>은 JetBrains가 개발한 오픈 소스 기술로, Android, iOS, 데스크톱 (Windows, macOS, Linux), 웹 및 백엔드 간에 코드 공유를 가능하게 합니다. 개발자는 네이티브 기능과 성능을 유지하면서 여러 환경에서 Kotlin을 재사용할 수 있습니다.</p>
    <p>채택이 꾸준히 증가하고 있습니다. 지난 두 번의 <a href="https://www.jetbrains.com/lp/devecosystem-2024/">개발자 에코시스템 설문조사</a> 응답자들 사이에서 Kotlin Multiplatform 사용률은 단 1년 만에 두 배 이상 증가하여, 2024년 7%에서 2025년 18%로 늘어났습니다. 이는 KMP의 성장 모멘텀을 명확히 보여주는 신호입니다.</p>
    <img src="kmp-growth-deveco.svg"
         alt="지난 두 번의 개발자 에코시스템 설문조사 응답자들 사이에서 KMP 사용률이 2024년 7%에서 2025년 18%로 증가했습니다."
         width="700"/>
    <p><a href="https://www.jetbrains.com/kotlin-multiplatform/"><img src="discover-kmp.svg"
                                                                      alt="Kotlin Multiplatform 알아보기"
                                                                      style="block"
                                                                      width="500"/></a></p>
    <p>KMP를 사용하면 앱 진입점을 제외한 모든 코드를 공유하는 것부터, 단일 로직 (네트워크 또는 데이터베이스 모듈과 같은)을 공유하거나, UI를 네이티브로 유지하면서 비즈니스 로직을 공유하는 등 다양한 공유 전략을 선택할 수 있습니다.</p>
    <p>플랫폼 간 UI 코드를 공유하려면 <a
            href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">Compose Multiplatform</a> — JetBrains의 최신 선언형 프레임워크를 사용할 수 있습니다. 이 프레임워크는 Kotlin Multiplatform과 Google의 Jetpack Compose를 기반으로 구축되었으며
        <a href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/?_gl=1*dcswc7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTA2NzU0MzQkbzM2JGcxJHQxNzUwNjc1NjEwJGo2MCRsMCRoMA..">iOS</a>, Android 및 데스크톱에서 안정적이며, 웹 지원은 현재 베타 단계에 있습니다.</p>
    <p><a href="https://www.jetbrains.com/compose-multiplatform/"><img src="explore-compose.svg"
                                                                       alt="Compose Multiplatform 탐색하기"
                                                                       style="block"
                                                                       width="500"/></a></p>
    <p>Kotlin 1.2 (2017년)에서 처음 소개된 Kotlin Multiplatform은 2023년 11월에 <a
            href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">안정화</a>되었습니다. Google I/O 2024에서 Google은 Android와 iOS 간에 비즈니스 로직을 공유하기 위해 <a
                    href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">Android에서 Kotlin Multiplatform 사용에 대한 공식 지원</a>을 발표했습니다.
    </p>
</chapter>
<chapter title="React Native" id="react-native">
    <p>React Native는 <a
            href="https://reactjs.org/">React</a> (웹 및 네이티브 사용자 인터페이스용 라이브러리)와 앱 플랫폼의 네이티브 기능을 사용하여 Android 및 iOS 애플리케이션을 구축하기 위한 오픈 소스 프레임워크입니다. React Native를 통해 개발자는 JavaScript를 사용하여 플랫폼의 API에 접근하고 재사용 및 중첩 가능한 코드 묶음인 React 컴포넌트를 사용하여 UI의 모양과 동작을 설명할 수 있습니다.</p>
    <p>React Native는 2015년 1월 React.js Conf에서 처음 발표되었습니다. 그 해 말, Meta는 F8 2015에서 React Native를 출시했으며 그 이후로 계속 유지보수하고 있습니다.</p>
    <p>Meta가 React Native 제품을 총괄하지만, <a
            href="https://github.com/facebook/react-native/blob/HEAD/ECOSYSTEM.md">React Native 생태계</a>는 파트너, 핵심 기여자 및 활발한 커뮤니티로 구성됩니다. 오늘날 이 프레임워크는 전 세계 개인과 기업의 기여로 지원됩니다.</p>
</chapter>
<chapter title="Kotlin Multiplatform vs. React Native: 상세 비교"
         id="kotlin-multiplatform-vs-react-native-side-by-side-comparison">
    <table style="both">
        <tr>
            <td></td>
            <td><b>Kotlin Multiplatform</b></td>
            <td><b>React Native</b></td>
        </tr>
        <tr>
            <td><b>개발 주체</b></td>
            <td>JetBrains</td>
            <td>Meta</td>
        </tr>
        <tr>
            <td><b>언어</b></td>
            <td>Kotlin</td>
            <td>JavaScript, TypeScript</td>
        </tr>
        <tr>
            <td><b>유연성 및 코드 재사용</b></td>
            <td>비즈니스 로직 및/또는 UI를 포함하여 코드베이스의 1%에서 100%까지 원하는 부분을 공유할 수 있습니다. 점진적으로 채택하거나 처음부터 사용하여 여러 플랫폼에서 네이티브 느낌의 앱을 구축할 수 있습니다.
            </td>
            <td>개별 기능부터 전체 앱에 이르기까지 비즈니스 로직과 UI 컴포넌트를 플랫폼 전반에 걸쳐 재사용할 수 있습니다. 기존 네이티브 애플리케이션에 React Native를 추가하여 새로운 화면이나 사용자 흐름을 구축할 수 있습니다.
            </td>
        </tr>
        <tr>
            <td><b>패키지, 의존성 및 생태계</b></td>
            <td>패키지는 <a href="https://central.sonatype.com/">Maven Central</a> 및 기타 저장소에서 사용할 수 있으며, 여기에는
                <p>KMP 라이브러리 검색을 단순화하도록 설계된 <a href="http://klibs.io">klibs.io</a> (알파 버전)가 포함됩니다.</p>
                <p>이 <a href="https://github.com/terrakok/kmp-awesome">목록</a>에는 가장 인기 있는 KMP 라이브러리 및 도구 중 일부가 포함되어 있습니다.</p></td>
            <td><a href="https://reactnative.dev/docs/libraries">React Native 라이브러리</a>는 일반적으로 <a href="https://www.npmjs.com/">npm 레지스트리</a>에서 <a href="https://docs.npmjs.com/cli/npm">npm CLI</a> 또는 <a href="https://classic.yarnpkg.com/en/">Yarn Classic</a>과 같은 Node.js 패키지 관리자를 사용하여 설치됩니다.
            </td>
        </tr>
        <tr>
            <td><b>빌드 도구</b></td>
            <td>Gradle (Apple 기기를 대상으로 하는 애플리케이션의 경우 Xcode 추가).</td>
            <td>React Native 명령줄 도구 및 <a href="https://metrobundler.dev/">Metro 번들러</a>는 내부적으로 Android용 Gradle 및 iOS용 Xcode 빌드 시스템을 호출합니다.
            </td>
        </tr>
        <tr>
            <td><b>대상 환경</b></td>
            <td>Android, iOS, 웹, 데스크톱 및 서버 측.</td>
            <td>Android, iOS, 웹 및 데스크톱.
                <p>웹 및 데스크톱 지원은 <a
                        href="https://github.com/necolas/react-native-web">React Native Web</a>, <a
                        href="https://github.com/microsoft/react-native-windows">React Native Windows</a> 및 <a
                        href="https://github.com/microsoft/react-native-macos">React Native macOS</a>와 같은 커뮤니티 및 파트너 주도 프로젝트를 통해 제공됩니다.</p></td>
        </tr>
        <tr>
            <td><b>컴파일</b></td>
            <td>데스크톱 및 Android용 JVM 바이트코드, 웹용 JavaScript 또는 Wasm, 네이티브 플랫폼용 플랫폼별 바이너리로 컴파일됩니다.
            </td>
            <td>React Native는 Metro를 사용하여 JavaScript 코드와 자산을 빌드합니다.
                <p>React Native에는 빌드 중에 JavaScript를 Hermes 바이트코드로 컴파일하는 <a
                        href="https://reactnative.dev/docs/hermes">Hermes</a>의 번들 버전이 함께 제공됩니다. React Native는 또한 <a
                        href="https://reactnative.dev/docs/javascript-environment">JavaScript 엔진</a>으로 JavaScriptCore를 사용하는 것을 지원합니다.</p>
                <p>네이티브 코드는 Android에서는 Gradle에 의해, iOS에서는 Xcode에 의해 컴파일됩니다.</p></td>
        </tr>
        <tr>
            <td><b>네이티브 API와의 통신</b></td>
            <td>Kotlin이 Swift/Objective-C 및 JavaScript와의 상호 운용성을 통해 Kotlin 코드에서 네이티브 API에 직접 접근할 수 있습니다.
            </td>
            <td>React Native는 네이티브 코드를 JavaScript 애플리케이션 코드에 연결하기 위한 일련의 API (Native Modules 및 Native Components)를 노출합니다. 새로운 아키텍처는 <a
                    href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md">Turbo Native Module</a> 및 <a
                    href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md">Fabric Native Components</a>를 사용하여 유사한 결과를 달성합니다.
            </td>
        </tr>
        <tr>
            <td><b>UI 렌더링</b></td>
            <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a>은 Google의 Jetpack Compose를 기반으로 하며, OpenGL, ANGLE (OpenGL ES 2 또는 3 호출을 네이티브 API로 변환), Vulkan 및 Metal과 호환되는 Skia 엔진을 사용하여 여러 플랫폼에서 UI를 공유하는 데 사용할 수 있습니다.
            </td>
            <td>React Native는 <code>View</code>,
                <code>Text</code>, <code>Image</code>와 같은 핵심적인 플랫폼에 독립적인 네이티브 컴포넌트 세트를 포함하며, 이들은 iOS의 <code>UIView</code> 및 Android의 <code>android.view</code>와 같이 플랫폼의 네이티브 UI 빌딩 블록에 직접 매핑됩니다.
            </td>
        </tr>
        <tr>
            <td><b>UI 개발 반복</b></td>
            <td>공통 코드에서도 UI 미리보기를 사용할 수 있습니다.
                <p><a href="compose-hot-reload.md">Compose Hot Reload</a>를 사용하면 앱을 다시 시작하거나 상태를 잃지 않고도 UI 변경 사항을 즉시 확인할 수 있습니다.</p></td>
            <td><a href="https://reactnative.dev/docs/fast-refresh">Fast Refresh</a>는 React 컴포넌트의 변경 사항에 대해 거의 즉각적인 피드백을 받을 수 있는 React Native 기능입니다.
            </td>
        </tr>
        <tr>
            <td><b>기술 사용 기업</b></td>
            <td>
                <a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>,
                <a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>, <a
                        href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald's</a>,
                <a href="https://youtu.be/5lkZj4v4-ks?si=DoW00DU7CYkaMmKc">Google Workspace</a>, <a
                        href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>, <a
                        href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>,
                <a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>, <a
                        href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>, <a
                        href="https://touchlab.co/">TouchLab</a>, <a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a> 등 더 많은 기업이 <a href="https://kotlinlang.org/case-studies/?type=multiplatform">KMP 사례 연구</a>에 나열되어 있습니다.</td>
            <td>Facebook, <a href="https://engineering.fb.com/2024/10/02/android/react-at-meta-connect-2024/">Instagram</a>,
                <a href="https://devblogs.microsoft.com/react-native/">Microsoft Office</a>, <a
                        href="https://devblogs.microsoft.com/react-native/">Microsoft Outlook</a>, Amazon Shopping,
                <a href="https://medium.com/mercari-engineering/why-we-decided-to-rewrite-our-ios-android-apps-from-scratch-in-react-native-9f1737558299">Mercari</a>,
                Tableau, <a href="https://github.com/wordpress-mobile/gutenberg-mobile">WordPress</a>, <a
                        href="https://nearform.com/work/puma-scaling-across-the-globe/">Puma</a>, PlayStation 앱 등 더 많은 기업이 <a href="https://reactnative.dev/showcase">React Native Showcase</a>에 나열되어 있습니다.
            </td>
        </tr>
    </table>
    <p>또한 <a href="kotlin-multiplatform-flutter.md">Kotlin Multiplatform과 Flutter</a>의 비교를 살펴볼 수 있습니다.</p>
</chapter>
<chapter title="프로젝트에 적합한 크로스 플랫폼 기술 선택"
         id="choosing-the-right-cross-platform-technology-for-your-project">
    <p>크로스 플랫폼 프레임워크를 결정하는 것은 만능 솔루션을 찾는 것이 아니라, 프로젝트의 목표, 기술 요구사항 및 팀 전문성에 가장 적합한 것을 선택하는 것입니다. 복잡한 UI를 가진 기능이 풍부한 제품을 구축하든, 기존 기술을 활용하여 빠르게 출시하는 것을 목표로 하든, 올바른 선택은 특정 우선순위에 따라 달라집니다. UI 사용자 지정에 필요한 제어 수준, 장기적인 안정성의 중요성, 지원할 플랫폼 등을 고려하세요.</p>
    <p>JavaScript에 익숙한 팀은 특히 빠른 프로토타이핑을 위해 React Native가 실용적인 선택이라고 생각할 수 있습니다. 반면에 Kotlin Multiplatform은 다른 수준의 통합을 제공합니다. 이는 완벽하게 네이티브 Android 앱을 생성하고, iOS에서는 네이티브 바이너리로 컴파일되며, 네이티브 API에 원활하게 접근할 수 있습니다. UI는 완전히 네이티브이거나 고성능 그래픽 엔진을 사용하여 아름답게 렌더링되는 Compose Multiplatform을 통해 공유될 수 있습니다. 이는 코드 공유의 이점을 누리면서도 네이티브 외관 및 느낌, 유지보수성, 성능을 우선시하는 팀에게 KMP를 특히 매력적으로 만듭니다.</p>
    <p>다음 프로젝트에 적합한 <a
            href="cross-platform-frameworks.md">크로스 플랫폼 개발 프레임워크</a>를 선택하는 방법에 대한 자세한 문서에서 더 많은 지침을 찾을 수 있습니다.</p>
</chapter>
<chapter title="자주 묻는 질문" id="frequently-asked-questions">
    <p>
        <control>Q: Kotlin Multiplatform은 프로덕션에 사용할 준비가 되었나요?</control>
    </p>
    <p>A: Kotlin Multiplatform은 <a
            href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">프로덕션에서 사용할 준비가 된 안정적인 기술</a>입니다.
        이는 가장 보수적인 사용 시나리오에서도 Android, iOS, 데스크톱 (JVM), 서버 측 (JVM) 및 웹 전반에서 코드를 공유하는 데 Kotlin Multiplatform을 사용할 수 있음을 의미합니다.</p>
    <p>Compose Multiplatform, 여러 플랫폼에서 공유 UI를 구축하기 위한 프레임워크 (Kotlin Multiplatform 및 Google의 Jetpack Compose 기반)는 iOS, Android, 데스크톱에서 안정적입니다. 웹 지원은 현재 베타 단계입니다.</p>
    <p>Kotlin Multiplatform의 전반적인 방향에 대해 더 자세히 알아보려면, 저희 블로그 게시물 <a href="https://blog.jetbrains.com/kotlin/2025/08/kmp-roadmap-aug-2025/">Kotlin Multiplatform 및 Compose Multiplatform의 다음 단계</a>를 확인하세요.</p>
    <p>
        <control>Q: Kotlin Multiplatform이 React Native보다 좋나요?</control>
    </p>
    <p>A: Kotlin Multiplatform과 React Native는 모두 고유한 강점을 가지고 있으며, 선택은 프로젝트의 특정 목표, 기술 요구사항 및 팀 전문성에 따라 달라집니다. 위 비교에서는 코드 공유, 빌드 도구, 컴파일 및 생태계와 같은 주요 차이점을 설명하여 사용 사례에 가장 적합한 옵션을 결정하는 데 도움을 드렸습니다.</p>
    <p>
        <control>Q: Google은 Kotlin Multiplatform을 지원하나요?</control>
    </p>
    <p>A: Google I/O 2024에서 Google은 Android와 iOS 간의 비즈니스 로직 공유를 위해 <a
            href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">Android에서 Kotlin Multiplatform 사용에 대한 공식 지원</a>을 발표했습니다.</p>
    <p>
        <control>Q: Kotlin Multiplatform을 배울 가치가 있나요?</control>
    </p>
    <p>A: 네이티브 성능과 유연성을 유지하면서 Android, iOS, 데스크톱 및 웹 전반에서 코드를 공유하는 데 관심이 있다면 Kotlin Multiplatform은 배울 가치가 있습니다. JetBrains의 지원을 받고 있으며, Android에서 Android와 iOS 간의 비즈니스 로직을 공유하는 데 Google의 공식 지원을 받습니다. 또한, Compose Multiplatform과 함께하는 KMP는 다중 플랫폼 앱을 구축하는 기업에서 프로덕션에 점점 더 많이 채택되고 있습니다.
    </p>
</chapter>
</topic>