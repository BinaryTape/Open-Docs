[//]: # (title: Kotlin 멀티플랫폼 샘플)
<show-structure for="none"/>

이것은 Kotlin 멀티플랫폼의 견고하고 독특한 애플리케이션을 보여주는 엄선된 프로젝트 목록입니다.

> 이 페이지에 대한 기여는 현재 받지 않습니다.
> Kotlin 멀티플랫폼 샘플로 프로젝트를 소개하려면 GitHub에서 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 토픽을 사용하세요.
> 토픽에 프로젝트를 소개하는 방법을 알아보려면 [GitHub 문서](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository)를 참조하세요.
>
{style="note"}

일부 프로젝트는 사용자 인터페이스에 Compose 멀티플랫폼을 사용하여 거의 모든 코드를 공유합니다.
다른 프로젝트는 사용자 인터페이스에 네이티브 코드를 사용하고, 예를 들어 데이터 모델과 알고리즘만 공유합니다.
새로운 Kotlin 멀티플랫폼 애플리케이션을 직접 만들려면 [웹 위저드](https://kmp.jetbrains.com)를 사용하는 것을 권장합니다.

[kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 토픽을 통해 GitHub에서 더 많은 샘플 프로젝트를 찾을 수 있습니다.
전체 생태계를 탐색하려면 [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform) 토픽을 확인해 보세요.

### JetBrains 공식 샘플

<table>
    
<tr>
<td>이름</td>
        <td>설명</td>
        <td>무엇을 공유하나요?</td>
        <td>주목할 만한 라이브러리</td>
        <td>사용자 인터페이스</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">Image Viewer</a></strong>
        </td>
        <td>사진을 캡처, 보고 저장하는 애플리케이션입니다. 지도 지원이 포함됩니다. UI에 Compose 멀티플랫폼을 사용합니다. [KotlinConf 2023](https://www.youtube.com/watch?v=FWVi4aV36d8)에서 소개되었습니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>애니메이션</li>
                <li>데이터 저장</li>
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
                <li>iOS, 데스크톱 및 웹의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">Chat</a></strong>
        </td>
        <td>SwiftUI 인터페이스 내에 Compose 멀티플랫폼 컴포넌트를 삽입하는 방법을 보여주는 데모입니다. 사용 사례는 온라인 메시징입니다.
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
                <li>iOS, 데스크톱 및 웹의 Compose 멀티플랫폼</li>
                <li>iOS의 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
        </td>
        <td>프로덕션 환경에서 Kotlin 멀티플랫폼을 사용하는 방법을 보여주기 위해 설계된 RSS 피드 소비 샘플 애플리케이션입니다. UI는 네이티브로 구현되었지만, iOS 및 데스크톱에서 Compose 멀티플랫폼이 어떻게 사용될 수 있는지 보여주는 실험적 브랜치도 있습니다. 네트워킹은 [Ktor HTTP 클라이언트](https://ktor.io/docs/create-client.html)를 사용하여 수행되며, XML 파싱은 네이티브로 구현됩니다. UI 상태 공유에는 Redux 아키텍처가 사용됩니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>UI 상태</li>
                <li>데이터 저장</li>
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
                <li>iOS 및 데스크톱의 Compose 멀티플랫폼 (실험적 브랜치)</li>
                <li>iOS의 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Sample</a></strong>
        </td>
        <td>간단한 계산기 애플리케이션입니다. <code>expected</code> 및 <code>actual</code> 선언을 사용하여 Kotlin과 네이티브 코드를 통합하는 방법을 보여줍니다.
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
        <td>무엇을 공유하나요?</td>
        <td>주목할 만한 라이브러리</td>
        <td>사용자 인터페이스</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>Kotlin 멀티플랫폼과 Compose 멀티플랫폼의 다양한 측면을 보여주는 프로젝트입니다. 사용 사례는 컨퍼런스 일정에 대한 정보를 가져오고 표시하는 애플리케이션입니다. Wear 및 Auto 플랫폼을 지원합니다. 클라이언트-서버 통신에 GraphQL을 사용합니다. 아키텍처는 [KotlinConf 2023](https://www.youtube.com/watch?v=uATlWUBSx8Q)에서 심층적으로 논의되었습니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장</li>
                <li>내비게이션</li>
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
                <li>iOS, 데스크톱 및 웹의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>Kotlin 멀티플랫폼이 실행될 수 있는 다양한 플랫폼을 보여주는 프로젝트입니다. 사용 사례는 현재 우주에 있는 사람들의 수와 국제 우주 정거장(International Space Station)의 위치를 보여주는 것입니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장</li>
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
                <li>iOS, 데스크톱 및 웹의 Compose 멀티플랫폼</li>
                <li>iOS 및 macOS의 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>Sessionize API를 사용하여 Droidcon 이벤트의 의제를 볼 수 있는 애플리케이션입니다. Sessionize에 강연을 저장하는 모든 이벤트에 맞게 사용자 정의할 수 있습니다. Firebase와 통합되므로 실행하려면 Firebase 계정이 필요합니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장</li>
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
                <li>iOS의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/KaMPKit">KaMPKit</a></strong>
        </td>
        <td>Kotlin 멀티플랫폼 개발을 위한 코드 및 도구 모음입니다. Kotlin 멀티플랫폼 애플리케이션을 구축할 때 라이브러리, 아키텍처 선택 및 모범 사례를 보여주기 위해 설계되었습니다. 사용 사례는 개 품종에 대한 정보를 다운로드하고 표시하는 것입니다. 이 [비디오 튜토리얼](https://www.youtube.com/watch?v=EJVq_QWaWXE)에서 소개되었습니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>ViewModel</li>
                <li>데이터 저장</li>
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
        <td>무엇을 공유하나요?</td>
        <td>주목할 만한 라이브러리</td>
        <td>사용자 인터페이스</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">NYTimes KMP</a></strong>
        </td>
        <td>뉴욕 타임즈 애플리케이션의 Compose 멀티플랫폼 기반 버전입니다. 사용자가 기사를 찾아보고 읽을 수 있습니다. 참고로 애플리케이션을 빌드하고 실행하려면 [뉴욕 타임즈에서 API 키](https://developer.nytimes.com/)가 필요합니다.
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
                <li>iOS, 데스크톱 및 웹의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>생산성 및 시간 관리 애플리케이션입니다. 사용자가 작업을 예약하고 성과에 대한 피드백을 제공할 수 있습니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>애니메이션</li>
                <li>데이터 저장</li>
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
                <li>Android, iOS 및 데스크톱의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">Recipe App</a></strong>
        </td>
        <td>레시피 보기를 위한 데모 애플리케이션입니다. 애니메이션 사용을 보여줍니다.</td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>데이터 저장</li>
            </list>
        </td>
        <td><p><code>kotlinx-coroutines</code></p></td>
        <td>
            <list>
                <li>Android의 Jetpack Compose</li>
                <li>iOS, 데스크톱 및 웹의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td>[Kotlin 멀티플랫폼 아키텍처를 사용한 선언형 UI](https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7) 샘플 애플리케이션입니다. 사용 사례는 여러 국가의 백신 접종 통계를 검색하고 표시하는 것입니다.
        </td>
        <td>
            <list>
                <li>네트워킹</li>
                <li>데이터 저장</li>
                <li>ViewModel</li>
                <li>내비게이션</li>
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
        <td>[The Movie Database](https://www.themoviedb.org/)에서 데이터를 소비하여 현재 인기 있는, 개봉 예정인, 인기 있는 영화 및 TV 프로그램을 표시하는 애플리케이션입니다. The Movie Database에서 API 키를 생성해야 합니다.
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
        <td>Twine은 Kotlin과 Compose 멀티플랫폼을 사용하여 구축된 멀티플랫폼 RSS 리더 앱입니다. 피드를 탐색할 수 있는 뛰어난 사용자 인터페이스와 경험을 제공하며, Material 3 콘텐츠 기반 동적 테마를 지원합니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장</li>
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
                <li>Android 및 iOS의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">Shopping By KMP</a></strong>
        </td>
        <td>Kotlin으로 여러 플랫폼에서 UI를 공유하기 위한 선언형 프레임워크인 Jetpack Compose 멀티플랫폼을 사용하여 구축된 크로스 플랫폼 애플리케이션입니다. 이 애플리케이션은 사용자가 Android, iOS, 웹, 데스크톱, Android Automotive 및 Android TV에서 쇼핑 카탈로그의 제품을 찾아보고, 검색하고, 구매할 수 있도록 합니다.
        </td>
        <td>
            <list>
                <li>모델</li>
                <li>네트워킹</li>
                <li>데이터 저장</li>
                <li>UI</li>
                <li>ViewModel</li>
                <li>애니메이션</li>
                <li>내비게이션</li>
                <li>UI 상태</li>
                <li>Use Case</li>
                <li>유닛 테스트</li>
                <li>UI 테스트</li>
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
                <li>Android, iOS, 웹, 데스크톱, 자동차 및 Android TV의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">Music App KMP</a></strong>
        </td>
        <td>MediaPlayer와 같은 네이티브 API와 다양한 플랫폼에서 상호 작용하는 방법을 보여주는 애플리케이션입니다. 데이터를 가져오기 위해 Spotify API를 사용합니다.
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
                <li>Android, iOS, 데스크톱 및 웹의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">Rijksmuseum</a></strong>
        </td>
        <td>Rijksmuseum은 암스테르담의 유명한 국립 미술관(Rijksmuseum)의 예술 컬렉션을 몰입감 있게 탐색할 수 있는 멀티모듈 Kotlin 및 Compose 멀티플랫폼 앱입니다. Rijksmuseum API를 활용하여 이미지 및 설명을 포함한 다양한 예술 작품에 대한 상세 정보를 가져오고 표시합니다.
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>모델</li>
                <li>네트워킹</li>
                <li>내비게이션</li>
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
                <li>Android, iOS, 데스크톱 및 웹의 Compose 멀티플랫폼</li>
            </list>
        </td>
</tr>

</table>