[//]: # (title: Kotlin Multiplatform 샘플)
<show-structure for="none"/>

이 페이지는 Kotlin Multiplatform의 견고하고 독특한 애플리케이션 사례를 보여주기 위해 엄선된 프로젝트 목록입니다.

> 현재 이 페이지에 대한 기여는 받지 않고 있습니다.
> 본인의 프로젝트를 Kotlin Multiplatform 샘플로 소개하려면 GitHub에서 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 토픽을 사용하세요.
> 프로젝트에 토픽을 추가하는 방법은 [GitHub 문서](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository)를 참조하세요.
>
{style="note"}

일부 프로젝트는 사용자 인터페이스(UI)를 위해 Compose Multiplatform을 사용하여 거의 모든 코드를 공유합니다.
다른 프로젝트들은 사용자 인터페이스에 네이티브 코드를 사용하고, 예를 들어 데이터 모델과 알고리즘만 공유하기도 합니다.
완전 새로운 Kotlin Multiplatform 애플리케이션을 직접 만들려면 [웹 위저드(web wizard)](https://kmp.jetbrains.com) 사용을 권장합니다.

[kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 토픽을 통해 GitHub에서 더 많은 샘플 프로젝트를 찾을 수 있습니다.
생태계 전체를 살펴보려면 [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform) 토픽을 확인해 보세요.

### JetBrains 공식 샘플

<table>
    
<tr>
<td>이름</td>
        <td>설명</td>
        <td>공유 항목</td>
        <td>주요 라이브러리</td>
        <td>사용자 인터페이스</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/kotlinconf-app">공식 KotlinConf 애플리케이션</a></strong>
        </td>
        <td><a href="https://kotlinconf.com/">KotlinConf</a>를 위한 동반 애플리케이션입니다.
            Android, iOS, 데스크톱 및 웹용 클라이언트 애플리케이션은 Compose Multiplatform을 사용하여 공유 UI로 구축되었습니다.
            백엔드 애플리케이션은 <a href="https://ktor.io/">Ktor</a> 서버 사이드 프레임워크와
            <a href="https://www.jetbrains.com/help/exposed/home.html">Exposed</a> 데이터베이스 라이브러리로 구동됩니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>ktor-client</code></li>
                <li><code>ktor-server</code></li>
                <li><code>multiplatform-settings</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">Image Viewer</a></strong>
        </td>
        <td>사진 캡처, 보기 및 저장 기능을 제공하는 애플리케이션입니다. 지도 지원이 포함되어 있습니다. UI에 Compose
            Multiplatform을 사용합니다. <a href="https://www.youtube.com/watch?v=FWVi4aV36d8">KotlinConf 2023</a>에서 소개되었습니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>애니메이션</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>play-services-maps</code></li>
                <li><code>play-services-locations</code></li>
                <li><code>android-maps-compose</code></li>
                <li><code>accompanist-permissions</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">Chat</a></strong>
        </td>
        <td>SwiftUI 인터페이스 내에 Compose Multiplatform 컴포넌트를 임베딩하는 방법을 보여주는 데모입니다. 온라인 메시징 유스케이스를 다룹니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
            </list>
        </td>
        <td/>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
                <li>iOS의 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/kotlin-hands-on/jetcaster-kmp-migration">Jetcaster Multiplatform</a></strong>
        </td>
        <td>Compose 샘플인 <a href="https://github.com/android/compose-samples/tree/main/Jetcaster">Jetcaster</a> 앱을
            멀티플랫폼으로 만든 버전으로, 기존 Android 버전에 iOS 및 데스크톱 타겟을 추가했습니다.
            UI는 Compose Multiplatform을 사용하도록 마이그레이션되었으며, 여러 라이브러리가 멀티플랫폼 버전이나
            대안으로 교체되었습니다.
            마이그레이션 이유와 과정은
            <a href="https://kotlinlang.org/docs/multiplatform/migrate-from-android.html">Jetcaster 마이그레이션 튜토리얼</a>에 설명되어 있습니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>UI</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>coil</code></li>
                <li><code>koin</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlin-test</code></li>
                <li><code>ktor-client</code></li>
                <li>Room</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android, iOS 및 데스크톱의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
        </td>
        <td>Kotlin Multiplatform이 실제 프로덕션에서 어떻게 사용될 수 있는지 보여주기 위해 설계된 RSS 피드 구독 샘플 애플리케이션입니다. 
            UI는 네이티브로 구현되었지만, iOS와 데스크톱에서 Compose Multiplatform을 사용하는 방법을 보여주는 실험용 브랜치가 있습니다. 
            네트워킹은 <a href="https://ktor.io/docs/create-client.html">Ktor HTTP 클라이언트</a>를 사용하며, XML 파싱은 네이티브로 구현되었습니다. 
            UI 상태(UI State) 공유를 위해 Redux 아키텍처를 사용합니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>UI 상태</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>ktor-client</code></li>
                <li><code>voyager</code></li>
                <li><code>coil</code></li>
                <li><code>multiplatform-settings</code></li>
                <li><code>napier</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS 및 데스크톱의 Compose Multiplatform (실험용 브랜치)</li>
                <li>iOS의 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Sample</a></strong>
        </td>
        <td>간단한 계산기 애플리케이션입니다. expected 및 actual 선언을 사용하여 Kotlin과 네이티브 코드를 통합하는 방법을 보여줍니다.
        </td>
        <td><p>알고리즘</p></td>
        <td/>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>SwiftUI</li>
            </list>
        </td>
</tr>

</table>

### 추천 샘플

<table>
    
<tr>
<td>이름</td>
        <td>설명</td>
        <td>공유 항목</td>
        <td>주요 라이브러리</td>
        <td>사용자 인터페이스</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>Kotlin Multiplatform 및 Compose Multiplatform의 다양한 측면을 보여주는 쇼케이스입니다. 
            컨퍼런스 일정 정보를 가져와서 표시하는 애플리케이션입니다. 
            Wear 및 Auto 플랫폼 지원을 포함합니다. 클라이언트-서버 통신에 GraphQL을 사용합니다. 
            아키텍처는 <a href="https://www.youtube.com/watch?v=uATlWUBSx8Q">KotlinConf 2023</a>에서 심도 있게 다루어졌습니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장소</li>
                <li>네비게이션</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>decompose</code></li>
                <li><code>koin</code></li>
                <li><code>jsonpathkt-kotlinx</code></li>
                <li><code>horologist</code></li>
                <li><code>google-cloud</code></li>
                <li><code>firebase</code></li>
                <li><code>bare-graphql</code></li>
                <li><code>apollo</code></li>
                <li><code>accompanist</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android, Auto 및 Wear의 Jetpack Compose</li>
                <li>iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>Kotlin Multiplatform이 실행될 수 있는 다양한 플랫폼을 보여주는 쇼케이스입니다. 
            현재 우주에 있는 사람 수와 국제 우주 정거장(ISS)의 위치를 보여줍니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>koin</code></li>
                <li><code>multiplatform-settings</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 및 Wear OS의 Jetpack Compose</li>
                <li>iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
                <li>iOS 및 macOS의 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>Sessionize API를 사용하여 Droidcon 행사 일정을 확인하는 애플리케이션입니다. 
            Sessionize에 강연 정보를 저장하는 모든 행사에 맞춰 커스터마이징할 수 있습니다. 
            Firebase와 연동되므로 실행하려면 Firebase 계정이 필요합니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>koin</code></li>
                <li><code>multiplatform-settings</code></li>
                <li><code>firebase</code></li>
                <li><code>kermit</code></li>
                <li><code>accompanist</code></li>
                <li><code>hyperdrive-multiplatformx</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/KaMPKit">KaMPKit</a></strong>
        </td>
        <td>Kotlin Multiplatform 개발을 위한 코드 및 도구 모음입니다. 
            Kotlin Multiplatform 애플리케이션을 구축할 때의 라이브러리, 아키텍처 선택 및 베스트 프랙티스를 보여주기 위해 설계되었습니다. 
            강아지 품종 정보를 다운로드하고 표시하는 유스케이스를 다룹니다. 이 <a href="https://www.youtube.com/watch?v=EJVq_QWaWXE">비디오 튜토리얼</a>에서 소개되었습니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>ViewModel</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>ktor-client</code></li>
                <li><code>koin</code></li>
                <li><code>multiplatform-settings</code></li>
                <li><code>kermit</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS의 SwiftUI</li>
            </list>
        </td>
</tr>

</table>

### 기타 커뮤니티 샘플

<table>
    
<tr>
<td>이름</td>
        <td>설명</td>
        <td>공유 항목</td>
        <td>주요 라이브러리</td>
        <td>사용자 인터페이스</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">NYTimes KMP</a></strong>
        </td>
        <td>Compose Multiplatform 기반의 New York Times 애플리케이션 버전입니다. 사용자가 기사를 검색하고 읽을 수 있습니다. 
            애플리케이션을 빌드하고 실행하려면 <a href="https://developer.nytimes.com/">New York Times의 API 키</a>가 필요합니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>ktor-client</code></li>
                <li><code>molecule</code></li>
                <li><code>decompose</code></li>
                <li><code>horologist</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 및 Wear의 Jetpack Compose</li>
                <li>iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>생산성 및 시간 관리 애플리케이션입니다. 사용자가 할 일을 예약하고 성취도에 대한 피드백을 제공합니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>애니메이션</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx.serialization</code></li>
                <li><code>kotlinx.coroutines</code></li>
                <li><code>kotlinx.datetime</code></li>
                <li><code>koin</code></li>
                <li><code>navigation-compose</code></li>
                <li><code>multiplatform-settings</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android, iOS 및 데스크톱의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">Recipe App</a></strong>
        </td>
        <td>레시피를 보기 위한 데모 애플리케이션입니다. 애니메이션 사용법을 보여줍니다.</td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>데이터 저장소</li>
            </list>
        </td>
        <td><p><code>kotlinx-coroutines</code></p></td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td><a href="https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7">
            Kotlin MultiPlatform 아키텍처를 활용한 선언형 UI(Declarative UIs with Kotlin MultiPlatform architecture)</a>의 샘플 애플리케이션입니다. 
            여러 국가의 백신 접종 통계를 가져와 표시하는 유스케이스를 다룹니다.
        </td>
        <td>
            <list>
                <li>네트워킹</li>
                <li>데이터 저장소</li>
                <li>ViewModel</li>
                <li>네비게이션</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>ktor-client</code></li>
                <li><code>multiplatform-settings</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS의 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/VictorKabata/Notflix">Notflix</a></strong>
        </td>
        <td><a href="https://www.themoviedb.org/">The Movie Database</a>의 데이터를 소모하여 
            현재 트렌드, 개봉 예정, 인기 영화 및 TV 쇼를 표시하는 애플리케이션입니다. 
            The Movie Database의 API 키 생성이 필요합니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>캐싱</li>
                <li>ViewModel</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>multiplatform-settings</code></li>
                <li><code>napier</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS의 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/msasikanth/twine">Twine - RSS Reader</a></strong>
        </td>
        <td>Twine은 Kotlin과 Compose Multiplatform을 사용하여 구축된 멀티플랫폼 RSS 리더 앱입니다. 
            피드를 탐색하기 위한 멋진 UI와 경험을 제공하며 Material 3 콘텐츠 기반 동적 테마를 지원합니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장소</li>
                <li>UI</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>napier</code></li>
                <li><code>decompose</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 및 iOS의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">Shopping By KMP</a></strong>
        </td>
        <td>Kotlin으로 여러 플랫폼 간에 UI를 공유하기 위한 선언형 프레임워크인 Jetpack Compose Multiplatform을 사용하여 구축된 크로스 플랫폼 애플리케이션입니다. 
            사용자는 Android, iOS, 웹, 데스크톱, Android Automotive 및 Android TV에서 쇼핑 카탈로그의 제품을 검색, 조회 및 구매할 수 있습니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장소</li>
                <li>UI</li>
                <li>ViewModel</li>
                <li>애니메이션</li>
                <li>네비게이션</li>
                <li>UI 상태</li>
                <li>유스케이스(Use Case)</li>
                <li>단위 테스트(Unit Test)</li>
                <li>UI 테스트(UI Test)</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>datastore</code></li>
                <li><code>koin</code></li>
                <li><code>google-map</code></li>
                <li><code>navigation-compose</code></li>
                <li><code>coil</code></li>
                <li><code>kotest</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android, iOS, 웹, 데스크톱, Automotive 및 Android TV의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">Music App KMP</a></strong>
        </td>
        <td>다양한 플랫폼에서 MediaPlayer와 같은 네이티브 API와 상호작용하는 방법을 보여주는 애플리케이션입니다. 
            Spotify API를 사용하여 데이터를 가져옵니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>UI</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>ktor-client</code></li>
                <li><code>decompose</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android, iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">Rijksmuseum</a></strong>
        </td>
        <td>Rijksmuseum은 암스테르담의 유명한 레이크스 미술관(Rijksmuseum)의 예술 작품 컬렉션을 몰입감 있게 탐색할 수 있는 멀티모듈 Kotlin 및 Compose Multiplatform 앱입니다. 
            Rijksmuseum API를 활용하여 이미지와 설명을 포함한 다양한 예술 작품에 대한 상세 정보를 가져와 표시합니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>네비게이션</li>
                <li>ViewModel</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>ktor-client</code></li>
                <li><code>koin</code></li>
                <li><code>navigation-compose</code></li>
                <li><code>Coil</code></li>
                <li><code>Jetpack ViewModel</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android, iOS, 데스크톱 및 웹의 Compose Multiplatform</li>
            </list>
        </td>
</tr>

</table>