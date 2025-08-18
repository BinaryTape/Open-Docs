[//]: # (title: 환경 설정)

첫 번째 Kotlin Multiplatform 애플리케이션을 생성하기 전에, KMP 개발을 위한 환경을 설정해야 합니다.

## 필수 도구 설치

호환성과 더 나은 성능을 위해 최신 안정화 버전을 설치하는 것을 권장합니다.

<table>
   
<tr>
<td>도구</td>
      <td>설명</td>
</tr>

    
<tr>
<td><a href="https://developer.android.com/studio">Android Studio</a></td>
        <td>Android Studio를 사용하여 멀티플랫폼 애플리케이션을 생성하고 시뮬레이션 또는 하드웨어 기기에서 실행할 수 있습니다.</td>
</tr>

    
<tr>
<td>
          <p><a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a></p>
          <p>시뮬레이션 또는 실제 기기에서 iOS 애플리케이션을 실행하려면 Xcode가 필요합니다. 다른 운영 체제를 사용하는 경우 이 도구는 건너뛰세요.</p>
        </td>
        <td>
          <p>별도의 창에서 Xcode를 실행하여 라이선스 약관에 동의하고 몇 가지 필수 초기 작업을 수행하도록 허용하세요.</p>
          <p>대부분의 경우 Xcode는 백그라운드에서 작동합니다. iOS 애플리케이션에 Swift 또는 Objective-C 코드를 추가하는 데 사용됩니다.</p>
            <note>
              <p>
                일반적으로 모든 도구에 최신 안정화 버전을 사용하는 것을 권장합니다. 하지만 Kotlin/Native는 때때로 최신 Xcode를 즉시 지원하지 않을 수 있습니다. <a href="multiplatform-compatibility-guide.md#version-compatibility">여기</a>에서 지원되는 버전을 확인할 수 있으며, 필요한 경우 <a href="https://developer.apple.com/download/all/?q=Xcode">이전 버전의 Xcode를 설치</a>할 수 있습니다.
              </p>
            </note>   
      </td>
</tr>

   
<tr>
<td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td>Java가 설치되어 있는지 확인하려면 Android Studio 터미널 또는 명령줄에서 다음 명령어를 실행하세요: <code style="block"
            lang="bash">java -version</code></td>
</tr>

   
<tr>
<td><Links href="/kmp/multiplatform-plugin-releases" summary="undefined">Kotlin Multiplatform plugin</Links></td>
        <td><p>Android Studio에서 **설정**(또는 **환경 설정**)을 열고 **플러그인** 페이지를 찾으세요. **마켓플레이스** 탭에서 *Kotlin Multiplatform*을 검색한 다음 설치하세요.</p>
</td>
</tr>

   
<tr>
<td><a href="https://kotlinlang.org/docs/releases.html#update-to-a-new-release">Kotlin plugin</a></td>
        <td>
            <p>Kotlin 플러그인은 Android Studio 릴리스와 함께 번들로 제공되며 자동으로 업데이트됩니다.</p>
        </td>
</tr>

</table>

## 환경 확인

모든 것이 예상대로 작동하는지 확인하려면 KDoctor 도구를 설치하고 실행하세요:

> KDoctor는 macOS에서만 작동합니다. 다른 운영 체제를 사용하는 경우 이 단계를 건너뛰세요.
>
{style="note"}

1. Android Studio 터미널 또는 명령줄 도구에서 Homebrew를 사용하여 도구를 설치하려면 다음 명령어를 실행하세요:

    ```bash
    brew install kdoctor
    ```

   아직 Homebrew가 없다면, [설치](https://brew.sh/)하거나 KDoctor [README](https://github.com/Kotlin/kdoctor#installation)에서 다른 설치 방법을 확인하세요.
2. 설치가 완료되면 콘솔에서 KDoctor를 호출하세요: 

    ```bash
    kdoctor
    ```

3. KDoctor가 환경을 확인하는 동안 문제를 진단하는 경우, 출력에서 문제와 가능한 해결책을 검토하세요:

   * 실패한 검사(`[x]`)를 수정하세요. 문제 설명과 잠재적 해결책은 `*` 기호 뒤에서 찾을 수 있습니다.
   * 경고(`[!]`) 및 성공 메시지(`[v]`)를 확인하세요. 여기에도 유용한 참고 사항과 팁이 포함될 수 있습니다.
   
   > CocoaPods 설치와 관련된 KDoctor 경고는 무시해도 됩니다. 첫 번째 프로젝트에서는 다른 iOS 프레임워크 배포 옵션을 사용할 것입니다.
   >
   {style="tip"}

## 가능한 문제 및 해결책

<deflist collapsible="true">
   <def title="Kotlin 및 Android Studio">
      <list>
         <li>Android Studio가 설치되어 있는지 확인하세요. <a href="https://developer.android.com/studio">공식 웹사이트</a>에서 다운로드할 수 있습니다.</li>
         <li>`Kotlin not configured` 오류가 발생할 수 있습니다. 이는 Android Studio Giraffe 2022.3의 알려진 문제로, 프로젝트 빌드 및 실행에는 영향을 미치지 않습니다. 이 오류를 피하려면 **무시**를 클릭하거나 Android Studio Hedgehog 2023.1로 업그레이드하세요.</li>
         <li>최신 Compose Multiplatform을 사용하여 UI 코드를 공유하려면 프로젝트에 Kotlin 2.1.0 이상을 사용해야 하며 (현재 버전은 %kotlinVersion%) Kotlin 2.1.0 이상으로 컴파일된 라이브러리에 의존해야 합니다. 그렇지 않으면 링크 오류가 발생할 수 있습니다.
         </li>
      </list>
   </def>
   <def title="Java 및 JDK">
         <list>
           <li>JDK가 설치되어 있는지 확인하세요. <a href="https://www.oracle.com/java/technologies/javase-downloads.html">공식 웹사이트</a>에서 다운로드할 수 있습니다.</li>
           <li>Android Studio는 번들로 제공되는 JDK를 사용하여 Gradle 작업을 실행합니다. Android Studio에서 Gradle JDK를 구성하려면 **설정/환경 설정 | 빌드, 실행, 배포 | 빌드 도구 | Gradle**을 선택하세요.</li>
           <li>`JAVA_HOME`과 관련된 문제가 발생할 수 있습니다. 이 환경 변수는 Xcode 및 Gradle에 필요한 Java 바이너리의 위치를 지정합니다. 이 경우 KDoctor의 팁을 따라 문제를 해결하세요.</li>
         </list>
   </def>
   <def title="Xcode">
      <list>
         <li>Xcode가 설치되어 있는지 확인하세요. <a href="https://developer.apple.com/xcode/">공식 웹사이트</a>에서 다운로드할 수 있습니다.</li>
         <li>아직 Xcode를 실행하지 않았다면 별도의 창에서 여세요. 라이선스 약관에 동의하고 몇 가지 필수 초기 작업을 수행하도록 허용하세요.</li>
         <li><p>`Error: can't grab Xcode schemes` 또는 명령줄 도구 선택과 관련된 다른 문제가 발생할 수 있습니다. 이 경우 다음 중 하나를 수행하세요:</p>
             <list>
               <li><p>터미널에서 다음을 실행하세요:</p>
                   <code style="block"
                         lang="bash">sudo xcode-select --switch /Applications/Xcode.app</code>
               </li>
               <li>또는 Xcode에서 **설정 | 위치**를 선택하세요. **명령줄 도구** 필드에서 Xcode 버전을 선택하세요.
                   <img src="xcode-schemes.png" alt="Xcode schemes" width="500"/>
                   <p>`Xcode.app` 경로가 선택되어 있는지 확인하세요. 필요한 경우 별도의 창에서 작업을 확인하세요.</p>
               </li>
             </list>
         </li>
      </list>
   </def>
   <def title="Kotlin 플러그인">
         <snippet>
            <p><strong>Kotlin Multiplatform 플러그인</strong></p>
               <list>
                  <li>Kotlin Multiplatform 플러그인이 설치되어 있고 활성화되어 있는지 확인하세요. Android Studio 시작 화면에서 **플러그인 | 설치됨**을 선택하세요. 플러그인이 활성화되어 있는지 확인하세요. **설치됨** 목록에 없다면 **마켓플레이스**에서 검색하여 플러그인을 설치하세요.</li>
                  <li>플러그인이 오래되었다면 플러그인 이름 옆의 **업데이트**를 클릭하세요. **설정/환경 설정 | 도구 | 플러그인** 섹션에서도 동일하게 할 수 있습니다.</li>
                  <li><a href="multiplatform-plugin-releases.md#release-details">여기</a> 표에서 Kotlin Multiplatform 플러그인과 Kotlin 버전의 호환성을 확인하세요.</li>
               </list>
         </snippet>
         <snippet>
            <p><strong>Kotlin 플러그인</strong></p>
            <p>Kotlin 플러그인이 최신 버전으로 업데이트되었는지 확인하세요. 이를 위해 Android Studio 시작 화면에서 **플러그인 | 설치됨**을 선택하세요. Kotlin 옆의 **업데이트**를 클릭하세요.</p>
         </snippet>
   </def>
   <def title="명령줄">
            <p>필요한 모든 도구가 설치되어 있는지 확인하세요:</p>
            <list>
              <li>`command not found: brew` – <a href="https://brew.sh/">Homebrew 설치</a>.</li>
              <li>`command not found: java` – <a href="https://www.oracle.com/java/technologies/javase-downloads.html">Java 설치</a>.</li>
           </list>
    </def>
   <def title="여전히 문제가 발생하나요?">
            <p><a href="https://kotl.in/issue">YouTrack 이슈를 생성</a>하여 팀과 문제를 공유하세요.</p>
   </def>
</deflist>

## 도움말 얻기

* **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
* **Kotlin 이슈 트래커**. [새로운 이슈 보고](https://youtrack.jetbrains.com/newIssue?project=KT).