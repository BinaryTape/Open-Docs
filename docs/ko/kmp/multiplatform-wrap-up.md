[//]: # (title: 프로젝트 마무리하기)

<tldr>
    <p>이 문서는 <strong>공유 로직과 네이티브 UI를 사용하는 Kotlin 멀티플랫폼 앱 만들기</strong> 튜토리얼의 마지막 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계"/> <Links href="/kmp/multiplatform-create-first-app" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin 멀티플랫폼 지원을 공유합니다. 이 문서는 공유 로직과 네이티브 UI를 사용하는 Kotlin 멀티플랫폼 앱 만들기 튜토리얼의 첫 번째 부분입니다. Kotlin 멀티플랫폼 앱 만들기 사용자 인터페이스 업데이트 종속성 추가 더 많은 로직 공유 프로젝트 마무리하기">Kotlin 멀티플랫폼 앱 만들기</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="두 번째 단계"/> <Links href="/kmp/multiplatform-update-ui" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin 멀티플랫폼 지원을 공유합니다. 이 문서는 공유 로직과 네이티브 UI를 사용하는 Kotlin 멀티플랫폼 앱 만들기 튜토리얼의 두 번째 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요. Kotlin 멀티플랫폼 앱 만들기 사용자 인터페이스 업데이트 종속성 추가 더 많은 로직 공유 프로젝트 마무리하기">사용자 인터페이스 업데이트</Links><br/>
       <img src="icon-3-done.svg" width="20" alt="세 번째 단계"/> <Links href="/kmp/multiplatform-dependencies" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin 멀티플랫폼 지원을 공유합니다. 이 문서는 공유 로직과 네이티브 UI를 사용하는 Kotlin 멀티플랫폼 앱 만들기 튜토리얼의 세 번째 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요. Kotlin 멀티플랫폼 앱 만들기 사용자 인터페이스 업데이트 종속성 추가 더 많은 로직 공유 프로젝트 마무리하기">종속성 추가</Links><br/>
       <img src="icon-4-done.svg" width="20" alt="네 번째 단계"/> <Links href="/kmp/multiplatform-upgrade-app" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin 멀티플랫폼 지원을 공유합니다. 이 문서는 공유 로직과 네이티브 UI를 사용하는 Kotlin 멀티플랫폼 앱 만들기 튜토리얼의 네 번째 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요. Kotlin 멀티플랫폼 앱 만들기 사용자 인터페이스 업데이트 종속성 추가 더 많은 로직 공유 프로젝트 마무리하기">더 많은 로직 공유</Links><br/>
       <img src="icon-5.svg" width="20" alt="다섯 번째 단계"/> <strong>프로젝트 마무리하기</strong><br/>
    </p>
</tldr>

iOS와 Android에서 모두 작동하는 첫 번째 Kotlin 멀티플랫폼 앱을 만들었습니다! 이제 크로스 플랫폼 모바일 개발 환경을 설정하고, IntelliJ IDEA에서 프로젝트를 생성하고, 기기에서 앱을 실행하며, 기능을 확장하는 방법을 알게 되었습니다.

Kotlin 멀티플랫폼에 대한 경험을 쌓았으니, 이제 몇 가지 고급 주제를 살펴보고 추가적인 크로스 플랫폼 모바일 개발 작업을 수행할 수 있습니다.

<table>
   
<tr>
<th>다음 단계</th>
      <th>심층 학습</th>
</tr>

   
<tr>
<td>
     <list>
        <li><Links href="/kmp/multiplatform-run-tests" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin 멀티플랫폼 지원을 공유합니다.">Kotlin 멀티플랫폼 프로젝트에 테스트 추가하기</Links></li>
        <li><Links href="/kmp/multiplatform-publish-apps" summary="undefined">모바일 애플리케이션을 앱 스토어에 게시하기</Links></li>
        <li><Links href="/kmp/multiplatform-introduce-your-team" summary="undefined">팀에 크로스 플랫폼 모바일 개발 도입하기</Links></li>
        <li><a href="https://klibs.io/">타겟 플랫폼에서 사용 가능한 Kotlin 멀티플랫폼 라이브러리 찾아보기</a></li>
        <li><a href="https://github.com/terrakok/kmm-awesome">유용한 도구 및 리소스 목록 확인하기</a></li>
     </list>
   </td>
    <td>
     <list>
        <li><Links href="/kmp/multiplatform-discover-project" summary="undefined">Kotlin 멀티플랫폼 프로젝트 구조</Links></li>
        <li><a href="https://kotlinlang.org/docs/native-objc-interop.html">Objective-C 프레임워크 및 라이브러리와의 상호 운용성</a></li>
        <li><Links href="/kmp/multiplatform-add-dependencies" summary="undefined">멀티플랫폼 라이브러리 종속성 추가하기</Links></li>        
        <li><Links href="/kmp/multiplatform-android-dependencies" summary="undefined">Android 종속성 추가하기</Links></li>
        <li><Links href="/kmp/multiplatform-ios-dependencies" summary="undefined">iOS 종속성 추가하기</Links></li>
     </list>
   </td>
</tr>

</table>

<table>
   
<tr>
<th>튜토리얼 및 샘플</th>
      <th>커뮤니티 및 피드백</th>
</tr>

   
<tr>
<td>
     <list>
        <li><Links href="/kmp/multiplatform-integrate-in-existing-app" summary="이 튜토리얼은 Android Studio를 사용하지만, IntelliJ IDEA에서도 따라 할 수 있습니다. 올바르게 설정하면 두 IDE는 동일한 핵심 기능과 Kotlin 멀티플랫폼 지원을 공유합니다.">Android 앱을 크로스 플랫폼으로 만들기</Links></li>
        <li><Links href="/kmp/multiplatform-ktor-sqldelight" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin 멀티플랫폼 지원을 공유합니다.">Ktor 및 SQLDelight를 사용하여 멀티플랫폼 앱 만들기</Links></li>
        <li><Links href="/kmp/compose-multiplatform-create-first-app" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin 멀티플랫폼 지원을 공유합니다. 이 문서는 공유 로직과 UI를 사용하는 Compose 멀티플랫폼 앱 만들기 튜토리얼의 첫 번째 부분입니다. Compose 멀티플랫폼 앱 만들기 컴포저블 코드 탐색 프로젝트 수정 나만의 애플리케이션 만들기">Compose Multiplatform를 사용하여 iOS와 Android 간 UI 공유하기</Links></li>
        <li><Links href="/kmp/multiplatform-samples" summary="undefined">엄선된 샘플 프로젝트 목록 확인하기</Links></li>
     </list>
   </td>
    <td>
     <list>
        <li><a href="https://kotlinlang.slack.com/archives/C3PQML5NU">Kotlin Slack의 #multiplatform 채널 참여하기</a></li>
        <li><a href="https://stackoverflow.com/questions/tagged/kotlin-multiplatform">Stack Overflow에서 "kotlin-multiplatform" 태그 구독하기</a></li>        
        <li><a href="https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C">Kotlin YouTube 채널 구독하기</a></li>
        <li><a href="https://youtrack.jetbrains.com/newIssue?project=KT">이슈 트래커에 문제 보고하기</a></li>
     </list>
   </td>
</tr>

</table>