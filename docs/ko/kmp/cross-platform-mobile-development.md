<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   id="cross-platform-mobile-development"
   title="크로스 플랫폼 모바일 개발이란 무엇인가요?"
   help-id="cross-platform-mobile-development">
<web-summary>크로스 플랫폼 모바일 개발의 정의, 프레임워크 비교(Kotlin Multiplatform, Flutter, React Native) 및 사례 연구를 포함한 크로스 플랫폼 모바일 개발에 대해 알아보세요.</web-summary>
<p>오늘날 많은 기업이 여러 플랫폼, 특히 안드로이드(Android)와 iOS 모두를 위한 모바일 앱을 구축해야 하는 과제에 직면해 있습니다. 이것이 바로 크로스 플랫폼 모바일 개발 솔루션이 가장 인기 있는 소프트웨어 개발 트렌드 중 하나로 떠오른 이유입니다.</p>
<p>최근 <a href="https://42matters.com/stats">앱 마켓플레이스 데이터</a>에 따르면, 구글 플레이 스토어에는 230만 개 이상의 앱이, 애플 앱스토어에는 약 220만 개의 앱이 등록되어 있으며, 안드로이드와 iOS는 전 세계 <a href="https://gs.statcounter.com/os-market-share/mobile/worldwide">모바일 앱 배포 및 사용</a> 시장을 계속해서 지배하고 있습니다.</p>
<p>안드로이드와 iOS 사용자 모두에게 도달할 수 있는 모바일 앱을 어떻게 만들 수 있을까요? 이 기사에서는 왜 점점 더 많은 모바일 엔지니어들이 크로스 플랫폼 또는 멀티플랫폼 모바일 개발 방식을 선택하고 있는지 알아보겠습니다.</p>
<chapter title="크로스 플랫폼 모바일 개발: 정의 및 솔루션" id="cross-platform-mobile-development-definition-and-solutions">
    <p>크로스 플랫폼 모바일 개발(멀티플랫폼 모바일 개발이라고도 함)은 팀이 단일 공유 코드베이스를 사용하여 여러 플랫폼용 애플리케이션을 구축할 수 있도록 하는 접근 방식입니다. 엔지니어는 완전히 분리된 두 개의 네이티브 앱을 개발하고 유지 관리하는 대신, 플랫폼 간에 재사용할 수 있는 공통 코드를 작성합니다.</p>
    <p>현대적인 <a href="cross-platform-frameworks.topic">크로스 플랫폼 프레임워크</a>를 사용하면 개발자는 앱 로직의 대부분을 한 번만 작성하여 안드로이드와 iOS 모두에서 공유할 수 있으므로, 중복된 노력을 크게 줄이고 배포 속도를 높일 수 있습니다. 예를 들어, <a href="kmp-overview.md">Kotlin Multiplatform</a>을 사용하면 엔지니어는 모든 비즈니스 로직을 재사용할 수 있으며, Compose Multiplatform을 통해 UI 코드까지 플랫폼 간에 공유할 수 있습니다.</p>
    <p><a href="https://kotlinlang.org/multiplatform/"><img src="discover-kmp.svg" alt="Discover Kotlin Multiplatform" width="600"/></a></p>
    <p>이러한 높은 수준의 코드 공유는 플랫폼 간에 일관된 사용자 경험을 보장하고, 중복 개발 노력을 줄이며, 장기적인 유지 관리 비용을 낮추는 데 도움이 됩니다. 동시에 현대적인 프레임워크는 개발자가 필요할 때 네이티브 API 및 플랫폼별 기능에 계속 접근할 수 있도록 해줍니다.</p>
    <p>코드 재사용과 네이티브 통합을 결합함으로써, 크로스 플랫폼 개발은 안드로이드와 iOS 사용자 모두에게 효율적으로 도달하려는 기업에 균형 잡힌 솔루션을 제공합니다.</p>
    <chapter title="모바일 앱 개발의 다양한 접근 방식" id="different-approaches-to-mobile-app-development">
        <p>크로스 플랫폼 솔루션은 지난 10년 동안 크게 발전했습니다. Apache Cordova 및 Ionic과 같은 초기 하이브리드 도구는 웹 기반 코드를 플랫폼 간에 공유할 수 있게 해주었지만, 종종 성능이 제한적이고 사용자 경험이 좋지 않았습니다. Kotlin Multiplatform 및 Flutter와 같은 현대적인 컴파일 프레임워크는 광범위한 코드 재사용과 함께 네이티브에 가까운 성능을 제공하며 네이티브 플랫폼 기능에 대한 더 깊은 접근을 제공합니다.</p>
        <p>안드로이드와 iOS 모두를 위한 애플리케이션을 만드는 데는 크게 네 가지 방법이 있습니다.</p>
          <list type="none">
              <li><a href="#1-separate-native-apps-for-each-operating-system">각 운영 체제별 별도의 네이티브 앱</a></li>
              <li><a href="#2-progressive-web-apps-pwas">프로그래시브 웹 앱 (PWAs)</a></li>
              <li><a href="#3-cross-platform-apps">크로스 플랫폼 앱</a></li>
              <li><a href="#4-hybrid-apps">하이브리드 앱</a></li>
          </list>
        <chapter title="1. 각 운영 체제별 별도의 네이티브 앱" id="1-separate-native-apps-for-each-operating-system">
            <p>네이티브 앱을 만들 때 개발자는 특정 운영 체제용 애플리케이션을 구축하며, 한 플랫폼을 위해 특별히 설계된 도구와 프로그래밍 언어에 의존합니다. 안드로이드의 경우 Kotlin 또는 Java, iOS의 경우 Swift 또는 Objective-C를 사용합니다.</p>
            <p>이러한 도구와 언어는 특정 OS의 기능과 성능에 접근할 수 있게 해주며, 직관적인 인터페이스를 갖춘 반응형 앱을 제작할 수 있게 해줍니다. 하지만 안드로이드와 iOS 사용자 모두에게 도달하고 싶다면 별도의 애플리케이션을 만들어야 하며, 이는 많은 시간과 노력이 소요됩니다.</p>
        </chapter>
        <chapter title="2. 프로그래시브 웹 앱 (PWAs)" id="2-progressive-web-apps-pwas">
            <p>프로그래시브 웹 앱(Progressive Web Apps)은 모바일 앱의 기능과 웹 개발에 사용되는 솔루션을 결합한 것입니다. 대략적으로 말하자면, 웹사이트와 모바일 애플리케이션의 혼합 형태를 제공합니다. 개발자는 JavaScript, HTML, CSS, WebAssembly와 같은 웹 기술을 사용하여 PWA를 구축합니다.</p>
            <p>웹 애플리케이션은 별도의 번들링이나 배포가 필요하지 않으며 온라인에 게시할 수 있습니다. 컴퓨터, 스마트폰, 태블릿의 브라우저를 통해 액세스할 수 있으며 구글 플레이나 앱스토어를 통해 설치할 필요가 없습니다.</p>
            <p>단점은 사용자가 앱을 사용하는 동안 연락처, 캘린더, 전화 및 기타 자산과 같은 기기의 모든 기능을 활용할 수 없어 사용자 경험이 제한된다는 점입니다. 앱 성능 측면에서는 네이티브 앱이 앞서 있습니다.</p>
        </chapter>
        <chapter title="3. 크로스 플랫폼 앱" id="3-cross-platform-apps">
            <p>앞서 언급했듯이, 멀티플랫폼 앱은 서로 다른 모바일 플랫폼에서 동일하게 실행되도록 설계되었습니다. 크로스 플랫폼 프레임워크를 사용하면 이러한 앱을 개발할 목적으로 공유 및 재사용 가능한 코드를 작성할 수 있습니다.</p>
            <p>이 접근 방식은 시간과 비용 측면의 효율성 등 여러 가지 이점이 있습니다. 크로스 플랫폼 모바일 개발의 장단점은 뒷부분에서 더 자세히 살펴보겠습니다.</p>
        </chapter>
        <chapter title="4. 하이브리드 앱" id="4-hybrid-apps">
            <p>웹사이트나 포럼을 둘러보다 보면 "크로스 플랫폼 모바일 개발(cross-platform mobile development)"과 "하이브리드 모바일 개발(hybrid mobile development)"이라는 용어를 혼용해서 사용하는 경우를 볼 수 있습니다. 그러나 이는 완전히 정확한 표현은 아닙니다.</p>
            <p>크로스 플랫폼 앱의 경우, 모바일 엔지니어는 코드를 한 번 작성한 다음 다른 플랫폼에서 재사용할 수 있습니다. 반면, 하이브리드 앱 개발은 네이티브 기술과 웹 기술을 결합하는 방식입니다. HTML, CSS 또는 JavaScript와 같은 웹 개발 언어로 작성된 코드를 네이티브 앱에 내장해야 합니다. Ionic Capacitor나 Apache Cordova와 같은 프레임워크를 사용하고, 플랫폼의 네이티브 기능에 접근하기 위해 추가 플러그인을 사용하여 이를 수행할 수 있습니다.</p>
            <p>크로스 플랫폼 개발과 하이브리드 개발의 유일한 유사점은 코드 공유 가능성입니다. 성능 측면에서 하이브리드 애플리케이션은 네이티브 앱과 대등하지 않습니다. 하이브리드 앱은 단일 코드베이스를 배포하기 때문에, 특정 OS에만 국한된 일부 기능이 다른 OS에서는 제대로 작동하지 않을 수 있습니다.</p>
        </chapter>
    </chapter>
    <chapter title="네이티브 또는 크로스 플랫폼 앱 개발: 오래된 논쟁" id="native-or-cross-platform-app-development-a-longstanding-debate">
        <p><a href="native-and-cross-platform.topic">네이티브와 크로스 플랫폼 개발을 둘러싼 논쟁</a>은 기술 커뮤니티에서 여전히 해결되지 않은 과제입니다. 두 기술 모두 끊임없이 진화하고 있으며 각자의 장점과 한계가 있습니다.</p>
        <p>일부 전문가들은 여전히 네이티브 앱의 강력한 성능과 더 나은 사용자 경험을 가장 중요한 이점으로 꼽으며 멀티플랫폼 솔루션보다 네이티브 모바일 개발을 선호합니다.</p>
        <p>그러나 많은 현대 기업은 안드로이드와 iOS 모두에서 더 빠르게 기능을 출시해야 합니다. 바로 이 지점에서 Kotlin Multiplatform과 같은 크로스 플랫폼 개발 기술이 도움이 될 수 있습니다. Duolingo와 같은 기업들은 이미 <a href="https://youtu.be/RJtiFt5pbfs?si=jNBydHcHPw-IIEVZ">그 효과를 확인</a>하고 있습니다. Duolingo의 Client Platform 팀 소속인 John Rodriguez는 다음과 같이 언급했습니다.</p>
        <note>
            <p>Duolingo의 고무적인 트렌드 중 하나는 내부적으로 Kotlin Multiplatform을 더 많이 사용할수록 배포 속도가 빨라진다는 것입니다. 무언가를 배우고 나면 그것에 정말 능숙해지기 마련입니다. [...] 이제 그 뒤에는 훨씬 더 많은 확신이 있으며, 우리는 그러한 지식을 쌓아가고 있습니다.</p>
        </note>
        <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg" alt="Explore Kotlin Multiplatform Case Studies" width="600"/></a></p>
    </chapter>
</chapter>
<chapter title="크로스 플랫폼 모바일 개발이 귀하에게 적합할까요?" id="is-cross-platform-mobile-development-right-for-you">
    <p>크로스 플랫폼 개발은 기술적인 이유뿐만 아니라 비즈니스적 이점 때문에 선택되는 경우가 많습니다. 플랫폼 간에 코드를 공유함으로써 팀은 중복된 개발 노력을 줄이고, 기능 배포를 가속화하며, 장기적인 유지 관리를 단순화할 수 있습니다.</p>
    <chapter title="크로스 플랫폼 모바일 개발의 이점" id="benefits-of-cross-platform-mobile-development">
        <p>기업들이 다른 옵션 대신 이 접근 방식을 선택하는 데에는 많은 이유가 있습니다.</p>
          <list type="none">
              <li><a href="#1-reusable-code">재사용 가능한 코드</a></li>
              <li><a href="#2-time-savings">시간 절약</a></li>
              <li><a href="#3-effective-resource-management">효율적인 리소스 관리</a></li>
              <li><a href="#4-attractive-opportunities-for-developers">개발자에게 매력적인 기회</a></li>
              <li><a href="#5-opportunity-to-reach-wider-audiences">더 넓은 사용자 층 확보 기회</a></li>
              <li><a href="#6-quicker-time-to-market-and-customization">빠른 시장 출시 및 커스터마이징</a></li>
          </list>
        <chapter title="1. 재사용 가능한 코드" id="1-reusable-code">
            <p>크로스 플랫폼 프로그래밍을 사용하면 모바일 엔지니어가 모든 운영 체제에 대해 새 코드를 작성할 필요가 없습니다. 단일 코드베이스를 사용하면 개발자가 API 호출, 데이터 저장, 데이터 직렬화 및 분석 구현과 같은 반복적인 작업에 소요되는 시간을 줄일 수 있습니다.</p>
            <p>Kotlin Multiplatform과 같은 기술을 사용하면 앱의 데이터, 비즈니스 및 프레젠테이션 레이어를 단 한 번만 구현할 수 있습니다. 또는 KMP를 점진적으로 도입할 수도 있습니다. 필터링 또는 정렬과 같이 자주 변경되고 대개 동기화가 깨지기 쉬운 로직 조각을 선택하여 크로스 플랫폼으로 만든 다음, 이를 공유 모듈로 프로젝트에 연결하세요.</p>
            <p>JetBrains에서는 정기적으로 Kotlin Multiplatform 설문 조사를 실시하여 커뮤니티 구성원들에게 서로 다른 플랫폼 간에 코드의 어느 부분을 공유하는지 묻고 있습니다.</p>
            <img src="survey-results-q1-q2-22.png" alt="Kotlin Multiplatform 사용자가 플랫폼 간에 공유할 수 있는 코드 부분" width="700"/>
        </chapter>
        <chapter title="2. 시간 절약" id="2-time-savings">
            <p>애플리케이션 로직의 상당 부분을 플랫폼 간에 공유할 수 있기 때문에 개발자는 중복된 기능을 줄일 수 있습니다. 이는 개발 노력을 줄여주며 팀이 두 플랫폼 모두에 새로운 기능을 더 빠르게 제공할 수 있게 합니다.</p>
        </chapter>
        <chapter title="3. 효율적인 리소스 관리" id="3-effective-resource-management">
            <p>단일 코드베이스를 보유하면 팀이 리소스를 더욱 효율적으로 관리하는 데 도움이 됩니다. 안드로이드와 iOS를 위한 별도의 코드베이스와 개발 워크플로를 유지하는 대신, 팀은 공유 컴포넌트에서 협업하고 작업을 중복하는 대신 제품 기능을 구축하는 데 집중할 수 있습니다.</p>
        </chapter>
        <chapter title="4. 개발자에게 매력적인 기회" id="4-attractive-opportunities-for-developers">
            <p>많은 모바일 엔지니어는 현대적인 크로스 플랫폼 기술을 제품의 기술 스택에서 매력적인 요소로 여깁니다. 개발자는 JSON 파싱과 같은 반복적이고 일상적인 작업을 수행해야 할 때 업무에 지루함을 느낄 수 있습니다. 그러나 새로운 기술과 과제는 그들에게 흥미, 동기 부여 및 업무의 즐거움을 되찾아줄 수 있습니다. 이러한 방식으로 현대적인 기술 스택을 갖추는 것은 실제로 모바일 개발 팀을 구성하고 팀원들이 오랫동안 몰입하고 열정을 유지하도록 하는 데 도움이 될 수 있습니다.</p>
        </chapter>
        <chapter title="5. 더 넓은 사용자 층 확보 기회" id="5-opportunity-to-reach-wider-audiences">
            <p>플랫폼 중 하나를 선택할 필요가 없습니다. 앱이 여러 운영 체제와 호환되므로 안드로이드와 iOS 사용자 모두의 요구를 충족하고 도달 범위를 극대화할 수 있습니다.</p>
        </chapter>
        <chapter title="6. 빠른 시장 출시 및 커스터마이징" id="6-quicker-time-to-market-and-customization">
            <p>플랫폼별로 다른 앱을 빌드할 필요가 없으므로 제품을 훨씬 빠르게 개발하고 출시할 수 있습니다. 또한 애플리케이션을 커스터마이징하거나 변형해야 하는 경우, 프로그래머가 코드베이스의 특정 부분에 작은 변경을 가하는 것이 더 쉽습니다. 이를 통해 사용자 피드백에 더욱 신속하게 대응할 수 있습니다.</p>
        </chapter>
    </chapter>
    <chapter title="크로스 플랫폼 개발 방식의 과제" id="challenges-of-a-cross-platform-development-approach">
        <p>모든 솔루션에는 나름의 한계가 있습니다. 기술 커뮤니티의 일부에서는 크로스 플랫폼 프로그래밍이 여전히 성능 문제로 어려움을 겪고 있다고 주장합니다. 또한 프로젝트 리더는 개발 프로세스 최적화에 집중하는 것이 앱의 사용자 경험에 부정적인 영향을 미칠 수 있다는 우려를 가질 수도 있습니다.</p>
        <p>그러나 기반 기술이 개선됨에 따라 크로스 플랫폼 솔루션은 점점 더 안정적이고, 적응력이 뛰어나며, 유연해지고 있습니다.</p>
        <p>자주 언급되는 또 다른 우려는 멀티플랫폼 개발이 플랫폼의 네이티브 기능을 완벽하게 지원하는 것을 불가능하게 만든다는 점입니다. 하지만 Kotlin Multiplatform에서는 Kotlin의 <a href="multiplatform-expect-actual.md">expected 및 actual 선언</a>을 사용하여 멀티플랫폼 앱이 플랫폼별 API에 접근할 수 있도록 할 수 있습니다. expected 및 actual 선언을 사용하면 공통 코드에서 여러 플랫폼에 걸쳐 동일한 함수를 호출할 수 있음을 "기대(expect)"한다고 정의하고, Kotlin의 Java 및 Objective-C/Swift와의 상호운용성 덕분에 모든 플랫폼별 라이브러리와 상호 작용할 수 있는 "실제(actual)" 구현을 제공할 수 있습니다.</p>
        <p>현대의 멀티플랫폼 프레임워크가 계속 발전함에 따라 모바일 엔지니어들이 네이티브와 유사한 경험을 제작할 수 있는 기회가 점점 더 많아지고 있습니다. 애플리케이션이 잘 작성되었다면 사용자는 그 차이를 알아채지 못할 것입니다. 그러나 제품의 품질은 선택하는 크로스 플랫폼 앱 개발 도구에 크게 좌우될 것입니다.</p>
    </chapter>
</chapter>
<chapter title="크로스 플랫폼 프레임워크 비교" id="cross-platform-framework-comparison">
    <p>여러 프레임워크를 통해 개발자는 공유 코드베이스를 사용하여 크로스 플랫폼 모바일 애플리케이션을 구축할 수 있습니다. 이들은 모두 안드로이드와 iOS 개발 간의 중복 작업을 줄이는 것을 목표로 하지만, 프로그래밍 언어, 렌더링 방식, 성능 특성 및 생태계 성숙도 면에서 차이가 있습니다.</p>
    <p>다음 개요는 오늘날 가장 널리 사용되는 크로스 플랫폼 프레임워크 일부를 비교합니다.</p>
    <table style="both">
        <tr>
            <td width="160"></td>
            <td width="50"><b>언어</b></td>
            <td width="230"><b>플랫폼 간 코드 공유</b></td>
            <td width="140"><b>커뮤니티 성숙도</b></td>
            <td width="130"><b>앱 사례</b></td>
        </tr>
        <tr>
            <td><b>Kotlin Multiplatform</b></td>
            <td>Kotlin</td>
            <td>
                필요한 경우 네이티브 플랫폼 코드를 유지하면서
                비즈니스 로직 및 UI의
                유연한 플랫폼 간 코드 공유.
            </td>
            <td>급격히 성장 중</td>
            <td>
                Duolingo, McDonald's,
                Forbes, Philips,
                H&amp;M, Bolt
            </td>
        </tr>
        <tr>
            <td><b>Flutter</b></td>
            <td>Dart</td>
            <td>
                대부분의 애플리케이션 로직과 UI를
                단일 Dart 코드베이스 내에서
                공유.
            </td>
            <td>크고 성숙함</td>
            <td>
                eBay Motors, Alibaba,
                Google Pay,
                ByteDance 앱들
            </td>
        </tr>
        <tr>
            <td><b>React Native</b></td>
            <td>
                JavaScript,
                TypeScript
            </td>
            <td>
                개별 기능에서 전체 애플리케이션까지
                비즈니스 로직 및 UI 컴포넌트를
                플랫폼 간에 공유.
            </td>
            <td>크고 성숙함</td>
            <td>
                Microsoft Office, Teams,
                Xbox Game Pass;
                Facebook, Instagram
            </td>
        </tr>
        <tr>
            <td><b>.NET MAUI</b></td>
            <td>C#, XAML</td>
            <td>
                단일 C# 코드베이스 내에서
                비즈니스 로직 및 UI를
                플랫폼 간에 공유.
            </td>
            <td>안정적임</td>
            <td>
                NBC Sports Next,
                Escola Agil,
                Azure App
            </td>
        </tr>
        <tr>
            <td><b>Ionic</b></td>
            <td>JavaScript</td>
            <td>
                대부분의 애플리케이션 로직과 UI를
                단일 웹 기반 코드베이스를 통해 공유하며,
                플러그인을 통해 네이티브 기능에 접근.
            </td>
            <td>성숙함</td>
            <td>
                T-Mobile,
                BBC (어린이용 앱),
                EA Games
            </td>
        </tr>
        <tr>
            <td><b>NativeScript</b></td>
            <td>
                JavaScript,
                TypeScript
            </td>
            <td>
                대부분의 애플리케이션 로직과 UI를
                단일 JavaScript 또는 TypeScript
                코드베이스 내에서 플랫폼 간에 공유.
            </td>
            <td>안정적임</td>
            <td>
                Daily Nanny,
                Groov, Breethe
            </td>
        </tr>
    </table>
    <p>또한 <a href="cross-platform-frameworks.topic">가장 인기 있는 크로스 플랫폼 기술</a>에 대한 더 자세한 개요를 확인할 수 있습니다.</p>
    <p><b>Kotlin Multiplatform</b></p>
    <p>Kotlin Multiplatform은 팀이 Kotlin을 사용하여 플랫폼 간에 애플리케이션 로직을 공유할 수 있도록 합니다. Compose Multiplatform을 사용하면 개발자는 UI를 포함한 애플리케이션 코드의 최대 100%까지 공유할 수 있으며, 필요할 때 네이티브 API와 계속 통합할 수 있습니다. 이 접근 방식을 통해 팀은 네이티브 기능을 유지하면서 단일 코드베이스에서 안드로이드, iOS, 데스크톱 및 웹용 애플리케이션을 구축할 수 있습니다.</p>
    <p><a href="get-started.topic"><img src="get-started-with-kmp.svg" alt="Get Started with Kotlin Multiplatform" width="600"/></a></p>
    <p><b>Flutter</b></p>
    <p>Flutter는 구글에서 만든 크로스 플랫폼 프레임워크로, Dart 프로그래밍 언어와 자체 렌더링 엔진을 사용합니다. UI 렌더링 레이어를 직접 제어하기 때문에 Flutter는 서로 다른 플랫폼에서 일관된 비주얼과 강력한 성능을 제공할 수 있습니다. <a href="kotlin-multiplatform-flutter.md">Kotlin Multiplatform과 Flutter</a>를 자세히 살펴보고 각 기능을 이해하여 크로스 플랫폼 프로젝트에 적합한 것을 결정해 보세요.</p>
    <p><b>React Native</b></p>
    <p>React Native는 개발자가 JavaScript와 React 라이브러리를 사용하여 모바일 앱을 구축할 수 있게 해줍니다. JavaScript 런타임을 통해 로직을 실행하면서 네이티브 UI 컴포넌트를 렌더링하므로 웹 개발 경험이 있는 팀 사이에서 인기가 높습니다. 제품과 팀에 적합한 선택을 하는 데 도움이 될 <a href="kotlin-multiplatform-react-native.topic">Kotlin Multiplatform과 React Native</a> 개요를 확인해 보세요.</p>
    <p><b>.NET MAUI</b></p>
    <p>.NET MAUI는 C#과 .NET 생태계를 사용하여 네이티브 모바일 및 데스크톱 애플리케이션을 구축하기 위한 Microsoft의 크로스 플랫폼 프레임워크입니다. 개발자는 단일 코드베이스에서 안드로이드, iOS, macOS 및 Windows를 타겟팅할 수 있으며 Visual Studio와 같은 도구와 밀접하게 통합됩니다.</p>
    <p><b>Ionic</b></p>
    <p>Ionic은 HTML, CSS, JavaScript와 같은 웹 기술을 사용하는 하이브리드 모바일 프레임워크입니다. 애플리케이션은 WebView 내부에서 실행되며 플러그인이나 네이티브 브리지를 통해 기기 기능에 접근하므로, 웹 개발 배경이 탄탄한 팀에게 좋은 옵션이 됩니다.</p>
    <p><b>NativeScript</b></p>
    <p>NativeScript는 JavaScript 또는 TypeScript를 사용하여 네이티브 모바일 앱을 구축하기 위한 오픈 소스 프레임워크입니다. 실제 네이티브 UI 컴포넌트를 렌더링하고 플랫폼 API에 직접 접근할 수 있게 하여 개발자가 네이티브 성능과 사용자 경험을 갖춘 크로스 플랫폼 앱을 만들 수 있도록 합니다.</p>
</chapter>
<chapter title="Kotlin Multiplatform 실제 활용 사례" id="real-world-kotlin-multiplatform-examples">
    <p>Duolingo, McDonald's, Netflix, 9GAG, VMware, Cash App, Philips 및 기타 많은 대기업들이 네이티브 성능과 플랫폼별 사용자 경험을 유지하면서 효율성을 높이기 위해 <a href="use-cases-examples.md">점점 더 많이 Kotlin Multiplatform을 도입</a>하고 있습니다. 그중 일부는 기존 Kotlin 코드의 특정 중요 부분을 공유하여 앱 안정성을 높이는 방식을 선택합니다. 다른 기업들은 앱 품질을 타협하지 않으면서 코드 재사용을 극대화하고 모바일, 데스크톱, 웹, TV에 걸쳐 모든 애플리케이션 로직을 공유하는 동시에 각 플랫폼의 네이티브 UI를 보존하는 것을 목표로 합니다. 이러한 접근 방식의 이점은 이미 이를 도입한 기업들의 사례를 통해 분명하게 드러납니다.</p>
    <p><b>Duolingo</b></p>
    <p>Duolingo는 Kotlin Multiplatform을 사용하여 모바일 플랫폼 전반의 개발 속도를 높이고 있습니다. 이 회사는 176개국 4,000만 명 이상의 일일 활성 사용자에게 안드로이드와 iOS 모두에서 매주 업데이트를 출시하고 있으며, 팀은 Kotlin Multiplatform이 플랫폼 전반에 걸쳐 기능을 더 빠르게 제공하는 데 점점 더 많은 도움이 되고 있다고 보고합니다. <a href="https://youtu.be/RJtiFt5pbfs?si=b8mndETdH-tplZQA">전체 영상 보기</a>.</p>
    <p><b>McDonald’s</b></p>
    <p>McDonald's 앱을 개발하는 Umain 팀은 처음에 결제 기능을 위해 Kotlin Multiplatform을 도입했으며 나중에 이를 모바일 애플리케이션 전반으로 확장했습니다. 공유 Kotlin 코드를 도입한 후, 팀은 크래시 감소와 플랫폼 전반의 성능 향상을 보고했습니다. 또한 이 전환은 팀이 별도의 안드로이드 및 iOS 팀에서 보다 통합된 모바일 개발 팀으로 이동하는 데 도움이 되었습니다. <a href="https://youtu.be/uCkYZ-PvCmw?si=eLG2rmq5Hw3yvt0i">전체 영상 보기</a>.</p>
    <p><b>Forbes</b></p>
    <p>iOS와 안드로이드 간에 로직의 80% 이상을 공유함으로써, Forbes는 이제 두 플랫폼 모두에서 새로운 기능을 동시에 출시하는 동시에 특정 플랫폼에 맞게 기능을 커스터마이징할 수 있는 유연성을 유지하고 있습니다. 이를 통해 팀은 혁신을 이루고 시장 요구에 더 빠르게 대응할 수 있게 되었습니다. <a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">전체 기사 읽기</a>.</p>
    <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg" alt="Explore Kotlin Multiplatform Case Studies" width="600"/></a></p>
    <p>또한 <a href="multiplatform-reasons-to-try.md">개발자가 기존 또는 신규 프로젝트에서 Kotlin Multiplatform 사용을 고려해야 하는 이유</a>와 이것이 왜 계속해서 관심을 끌고 있는지 살펴볼 수 있습니다.</p>
</chapter>
<chapter title="자주 묻는 질문(FAQ)" id="frequently-asked-questions">
    <p><b>Q: 크로스 플랫폼 모바일 개발이란 무엇인가요?</b></p>
    <p>A: 크로스 플랫폼 모바일 개발(크로스 플랫폼 앱 개발이라고도 함)은 하나의 코드베이스를 사용하여 여러 운영 체제(예: iOS 및 안드로이드)에서 실행되는 애플리케이션을 구축할 수 있게 하는 접근 방식입니다. 개발자는 플랫폼 간에 코드를 공유함으로써 비용을 절감하고 시장에 더 빨리 출시할 수 있습니다.</p>
    <p><b>Q: 크로스 플랫폼 프레임워크를 어떻게 선택해야 하나요?</b></p>
    <p>A: 팀의 기술, 프로젝트 요구 사항 및 장기적인 제품 목표를 기반으로 크로스 플랫폼 프레임워크를 선택하세요. 예를 들어, Kotlin Multiplatform은 성능, 유지 관리성, 네이티브 룩앤필(look and feel)에 집중하는 팀에게 특히 매력적이며, 특히 공유 UI 코드를 위해 Compose Multiplatform을 사용할 때 더욱 그렇습니다. React Native는 JavaScript와 React에 익숙한 팀이 빠른 프로토타이핑을 위해 선호하는 경우가 많습니다. .NET MAUI는 .NET 생태계에서 작업하는 개발자들에게 강력한 선택지입니다.</p>
    <p><b>Q: Kotlin Multiplatform과 Compose Multiplatform의 차이점은 무엇인가요?</b></p>
    <p>A: <a href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform</a>은 안드로이드, iOS, 데스크톱, 웹 및 서버를 포함한 여러 플랫폼에서 코드를 공유할 수 있게 해주는 핵심 기술입니다. 이는 개발자가 원하지 않는 한 네이티브 UI를 대체하지 않고 코드 재사용에 집중합니다. <a href="https://kotlinlang.org/compose-multiplatform/">Compose Multiplatform</a>은 Kotlin Multiplatform 위에 구축된 선택적 UI 프레임워크입니다. 이는 안드로이드의 Jetpack Compose와 유사한 현대적인 선언형 접근 방식을 사용하여 사용자 인터페이스를 플랫폼 간에 공유할 수 있게 해줍니다. 이를 사용하여 단일 코드베이스에서 안드로이드, iOS, 데스크톱 및 웹을 위한 시각적으로 매력적이고 반응이 빠른 UI를 구축할 수 있습니다.</p>
    <p><b>Q: 가장 인기 있는 모바일 개발 프레임워크는 무엇인가요?</b></p>
    <p>A: 크로스 플랫폼 모바일 앱 개발을 위한 인기 있는 프레임워크로는 Kotlin Multiplatform, Flutter, React Native, .NET MAUI 등이 있습니다. 자신의 필요에 가장 적합한 것을 찾으려면 <a href="cross-platform-frameworks.topic">가장 인기 있는 크로스 플랫폼 기술 개요</a>를 확인할 수 있습니다.</p>
    <p>팀이 새로운 멀티플랫폼 기술을 도입하는 데 도움이 필요하다면, <a href="multiplatform-introduce-your-team.md"><i>팀에 멀티플랫폼 개발을 도입하는 방법</i></a> 가이드를 검토해 보시기 바랍니다.</p>
    <p><a href="get-started.topic"><img src="get-started-with-kmp.svg" alt="Get Started with Kotlin Multiplatform" width="600"/></a></p>
</chapter>
<chapter title="결론" id="conclusion">
    <p>크로스 플랫폼 개발 솔루션이 계속 발전함에 따라, 그 한계는 제공하는 이점에 비해 미미해지기 시작했습니다. 시장에는 다양한 기술이 나와 있으며, 각각 다른 워크플로와 요구 사항에 적합합니다. 이 기사에서 논의된 각 도구는 크로스 플랫폼 도입을 고민하는 팀을 위해 광범위한 지원을 제공합니다.</p>
    <p>궁극적으로 특정 비즈니스 요구 사항, 목적 및 과제를 신중하게 고려하고 앱을 통해 달성하고자 하는 명확한 목표를 개발하는 것이 귀하에게 가장 적합한 솔루션을 찾는 데 도움이 될 것입니다.</p>
</chapter>
</topic>