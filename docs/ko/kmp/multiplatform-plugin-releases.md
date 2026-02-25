[//]: # (title: Kotlin Multiplatform IDE 플러그인 릴리스)

[Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)은 Android, iOS, 데스크톱 및 웹을 위한 크로스 플랫폼 애플리케이션 개발을 지원합니다. Kotlin Multiplatform 프로젝트를 작업할 때는 항상 최신 버전의 플러그인을 사용하고 있는지 확인하세요.

이 플러그인은 IntelliJ IDEA 및 Android Studio와 호환됩니다:
* IntelliJ IDEA는 macOS에서 2025.1.1.1 버전부터, Windows 및 Linux에서는 2025.2.2 버전부터 이 플러그인을 지원합니다.
* Android Studio는 macOS에서 Narwhal 2025.1.1 버전부터, Windows 및 Linux에서는 Otter 2025.2.1 버전부터 이 플러그인을 지원합니다.

Kotlin Multiplatform Gradle 플러그인에 대한 정보는 [DSL 레퍼런스](multiplatform-dsl-reference.md) 및 [호환성 가이드](multiplatform-compatibility-guide.md)를 참조하세요.

## 최신 릴리스로 업데이트

새로운 Kotlin Multiplatform 플러그인 릴리스가 출시되면 IDE에서 즉시 업데이트를 제안합니다. 제안을 수락하면 플러그인이 최신 버전으로 업데이트됩니다. 플러그인 설치를 완료하려면 IDE를 다시 시작하세요.

**Settings** | **Plugins**에서 플러그인 버전을 확인하고 수동으로 업데이트할 수 있습니다.

플러그인이 올바르게 작동하려면 호환되는 버전의 Kotlin이 필요합니다. 호환 버전은 [릴리스 상세 정보](#release-details)에서 확인할 수 있습니다. Kotlin 버전을 확인하고 업데이트하려면 **Settings** | **Plugins**로 이동하거나 **Tools** | **Kotlin** | **Configure Kotlin in Project**를 선택하세요.

> 호환되는 Kotlin 버전이 설치되어 있지 않으면 Kotlin Multiplatform 플러그인이 비활성화됩니다. Kotlin 버전을 업데이트한 다음 **Settings** | **Plugins**에서 플러그인을 다시 활성화하세요.
>
{style="note"}

## 릴리스 상세 정보

다음 표는 Kotlin Multiplatform IDE 플러그인의 릴리스 목록입니다: 

<table> 

<tr>
<th>
릴리스 정보
</th>
<th>
릴리스 주요 사항
</th>
<th>
호환되는 Kotlin 버전
</th>
</tr>

<tr id="0.9">
<td>

**0.9**

출시일: 2025년 5월 19일

</td>
<td>

Kotlin Multiplatform 플러그인이 기초부터 완전히 재구축되었습니다:

* 지원되는 IDE를 위한 통합된 **새 프로젝트(New Project)** 마법사.
* Java, Android, Xcode 및 Gradle 설정을 포함하여 설정 문제를 찾고 해결하는 데 도움을 주는 사전 환경 점검(Preflight environment checks).
* iOS 및 Android 기기 선택기가 포함된, 지원되는 모든 플랫폼에 대해 자동 생성된 실행 구성(run configurations).
* 교차 언어 지원: Swift 및 Kotlin에 대한 교차 언어 탐색 및 디버깅, Swift 구문 강조 및 빠른 문서(quick documentation) 제공.
* Compose Multiplatform 지원: Kotlin Multiplatform IDE 플러그인이 이제 공통 코드(common code)에 대한 Compose Multiplatform 리소스, 자동 완성 및 UI 미리보기를 지원합니다([이전 Compose Multiplatform 플러그인](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)은 안전하게 삭제해도 됩니다).
* Compose 핫 리로드(Hot Reload): 앱을 다시 시작하지 않고도 UI 변경 사항을 즉시 확인(데스크톱 JVM 타겟 대상). 자세한 내용은 [핫 리로드 문서](compose-hot-reload.md)를 참조하세요.

알려진 문제:

* Android Studio에서 Compose 디버거가 현재 Kotlin 2.1.20 및 2.1.21과 함께 작동하지 않습니다. 이 문제는 Kotlin 2.2.0-RC2에서 해결될 예정입니다.

</td>
<td>

이 플러그인은 [모든 Kotlin 버전](https://kotlinlang.org/docs/releases.html#release-details)과 호환되지만, 대부분의 기능은 Kotlin 2.1.21에 의존합니다. 최상의 경험을 위해 최신 안정화 버전의 Kotlin으로 업데이트하는 것이 좋습니다.

또한 이 버전은 K2 모드가 필요하므로 활성화되어 있는지 확인하세요: **Settings** | **Languages & Frameworks** | **Kotlin**에서 **Enable K2 mode**를 체크하세요.

</td>
</tr>

<tr>
<td>

**0.8.4**

출시일: 2024년 12월 6일

</td>
<td>

* 안정성 및 코드 분석 개선을 위한 Kotlin [K2 모드](https://kotlinlang.org/docs/k2-compiler-migration-guide.html#support-in-ides) 지원.

</td>
<td>

[모든 Kotlin 플러그인 버전](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.3**

출시일: 2024년 7월 23일

</td>
<td>

* Xcode 호환성 문제 수정.

</td>
<td>

[모든 Kotlin 플러그인 버전](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.2**

출시일: 2024년 5월 16일

</td>
<td>

* Android Studio Jellyfish 및 새로운 Canary 버전인 Koala 지원.
* 공유 모듈(shared module)에 `sourceCompatibility` 및 `targetCompatibility` 선언 추가.

</td>
<td>

[모든 Kotlin 플러그인 버전](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.1**

출시일: 2023년 11월 9일

</td>
<td>

* Kotlin 1.9.20으로 업데이트.
* Jetpack Compose 1.5.4로 업데이트.
* Gradle 빌드 및 구성 캐시(build and configuration caches)를 기본적으로 활성화.
* 새 Kotlin 버전에 맞춰 빌드 구성 리팩토링.
* iOS 프레임워크가 이제 기본적으로 정적(static)으로 설정됨.
* Xcode 15에서 iOS 기기를 실행할 때 발생하는 문제 수정.

</td>
<td>

[모든 Kotlin 플러그인 버전](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.0**

출시일: 2023년 10월 5일

</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) Gradle 버전 카탈로그(version catalog)로 마이그레이션.
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) `android`를 `androidTarget`으로 이름 변경.
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) Kotlin 및 종속성 버전 업데이트.
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) `-sdk` 및 `-arch` 대신 `-destination` 인수를 사용하도록 리팩토링.
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 생성된 파일 이름 리팩토링.
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) JVM 타겟 구성 추가.
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) Xcode 15.0 지원.
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 새 모듈 마법사를 실험적(experimental) 상태로 이동.

</td>
<td>

[모든 Kotlin 플러그인 버전](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.6.0**

출시일: 2023년 5월 24일

</td>
<td>

* 새로운 Canary Android Studio Hedgehog 지원.
* Multiplatform 프로젝트의 Kotlin, Gradle 및 라이브러리 버전 업데이트.
* Multiplatform 프로젝트에 새로운 [`targetHierarchy.default()`](https://kotlinlang.org/docs/whatsnew1820.html#new-approach-to-source-set-hierarchy) 적용.
* Multiplatform 프로젝트의 플랫폼별 파일에 소스 세트 이름 접미사 적용.

</td>
<td>

[모든 Kotlin 플러그인 버전](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.3**

출시일: 2023년 4월 12일

</td>
<td>

* Kotlin 및 Compose 버전 업데이트.
* Xcode 프로젝트 스킴(scheme) 파싱 수정.
* 스킴 프로덕트 타입 체크 추가.
* `iosApp` 스킴이 있는 경우 이제 기본적으로 선택됨.

</td>
<td>

[모든 Kotlin 플러그인 버전](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.2**

출시일: 2023년 1월 30일

</td>
<td>

* [Kotlin/Native 디버거 문제 수정(Spotlight 인덱싱 지연)](https://youtrack.jetbrains.com/issue/KT-55988).
* [멀티모듈 프로젝트의 Kotlin/Native 디버거 수정](https://youtrack.jetbrains.com/issue/KT-24450).
* [Android Studio Giraffe 2022.3.1 Canary를 위한 새 빌드](https://youtrack.jetbrains.com/issue/KT-55274).
* [iOS 앱 빌드를 위한 프로비저닝 플래그 추가](https://youtrack.jetbrains.com/issue/KT-55204).
* [생성된 iOS 프로젝트의 **Framework Search Paths** 옵션에 상속된 경로 추가](https://youtrack.jetbrains.com/issue/KT-55402).

</td>
<td>

[모든 Kotlin 플러그인 버전](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.1**

출시일: 2022년 11월 30일

</td>
<td>

* [새 프로젝트 생성 시 불필요한 "app" 디렉토리가 삭제되도록 수정](https://youtrack.jetbrains.com/issue/KTIJ-23790).

</td>
<td>

[Kotlin 1.7.0—*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.0**

출시일: 2022년 11월 22일

</td>
<td>

* [iOS 프레임워크 배포 기본 옵션 변경: 이제 **Regular framework**가 기본값임](https://youtrack.jetbrains.com/issue/KT-54086).
* [생성된 Android 프로젝트에서 `MyApplicationTheme`을 별도 파일로 이동](https://youtrack.jetbrains.com/issue/KT-53991).
* [생성되는 Android 프로젝트 업데이트](https://youtrack.jetbrains.com/issue/KT-54658).
* [새 프로젝트 디렉토리가 예기치 않게 삭제되는 문제 수정](https://youtrack.jetbrains.com/issue/KTIJ-23707).

</td>
<td>

[Kotlin 1.7.0—*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.4**

출시일: 2022년 9월 12일

</td>
<td>

* [Android 앱을 Jetpack Compose로 마이그레이션](https://youtrack.jetbrains.com/issue/KT-53162).
* [오래된 HMPP 플래그 제거](https://youtrack.jetbrains.com/issue/KT-52248).
* [Android manifest에서 패키지 이름 제거](https://youtrack.jetbrains.com/issue/KTIJ-22633).
* [Xcode 프로젝트를 위한 `.gitignore` 업데이트](https://youtrack.jetbrains.com/issue/KT-53703).
* [expect/actual을 더 잘 보여주도록 마법사 프로젝트 업데이트](https://youtrack.jetbrains.com/issue/KT-53928).
* [Android Studio Canary 빌드와의 호환성 업데이트](https://youtrack.jetbrains.com/issue/KTIJ-22063).
* [Android 앱의 최소 Android SDK를 21로 상향](https://youtrack.jetbrains.com/issue/KTIJ-22505).
* [Xcode 설치 후 첫 실행 시 발생하는 문제 수정](https://youtrack.jetbrains.com/issue/KTIJ-22645).
* [M1에서 Apple 실행 구성과 관련된 문제 수정](https://youtrack.jetbrains.com/issue/KTIJ-21781).
* [Windows OS에서 `local.properties`와 관련된 문제 수정](https://youtrack.jetbrains.com/issue/KTIJ-22037).
* [Android Studio Canary 빌드에서 Kotlin/Native 디버거 문제 수정](https://youtrack.jetbrains.com/issue/KT-53976).

</td>
<td>

[Kotlin 1.7.0—1.7.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.3**

출시일: 2022년 6월 9일

</td>
<td>

* Kotlin IDE 플러그인 1.7.0에 대한 종속성 업데이트.

</td>
<td>

[Kotlin 1.7.0—1.7.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.2**

출시일: 2022년 4월 4일

</td>
<td>

* Android Studio 2021.2 및 2021.3에서 iOS 애플리케이션 디버그 시 성능 문제 수정.

</td>
<td>

[Kotlin 1.5.0—1.6.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.1**

출시일: 2022년 2월 15일

</td>
<td>

* [Kotlin Multiplatform Mobile 마법사에서 M1 iOS 시뮬레이터 활성화](https://youtrack.jetbrains.com/issue/KT-51105).
* XcProjects 인덱싱 성능 개선: [KT-49777](https://youtrack.jetbrains.com/issue/KT-49777), [KT-50779](https://youtrack.jetbrains.com/issue/KT-50779).
* 빌드 스크립트 정리: `kotlin("test-common")` 및 `kotlin("test-annotations-common")` 대신 `kotlin("test")` 사용.
* [Kotlin 플러그인 버전](https://youtrack.jetbrains.com/issue/KTIJ-20167)과의 호환 범위 확대.
* [Windows 호스트에서 JVM 디버그 문제 수정](https://youtrack.jetbrains.com/issue/KT-50699).
* [플러그인 비활성화 후 버전이 잘못 표시되는 문제 수정](https://youtrack.jetbrains.com/issue/KT-50966).

</td>
<td>

[Kotlin 1.5.0—1.6.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.0**

출시일: 2021년 11월 16일

</td>
<td>

* [새로운 Kotlin Multiplatform Library 마법사](https://youtrack.jetbrains.com/issue/KTIJ-19367).
* 새로운 방식의 Kotlin Multiplatform 라이브러리 배포 지원: [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks).
* 새로운 크로스 플랫폼 모바일 프로젝트에 [계층적 프로젝트 구조(hierarchical project structure)](multiplatform-hierarchy.md#manual-configuration) 활성화.
* [명시적 iOS 타겟 선언](https://youtrack.jetbrains.com/issue/KT-46861) 지원.
* [비 Mac 환경에서 Kotlin Multiplatform Mobile 플러그인 마법사 활성화](https://youtrack.jetbrains.com/issue/KT-48614).
* [Kotlin Multiplatform 모듈 마법사에서 하위 폴더 지원](https://youtrack.jetbrains.com/issue/KT-47923).
* [Xcode `Assets.xcassets` 파일 지원](https://youtrack.jetbrains.com/issue/KT-49571).
* [플러그인 클래스로더 예외 수정](https://youtrack.jetbrains.com/issue/KT-48103).
* CocoaPods Gradle 플러그인 템플릿 업데이트.
* Kotlin/Native 디버거 타입 평가(type evaluation) 개선.
* Xcode 13을 사용한 iOS 기기 실행 문제 수정.

</td>
<td>

[Kotlin 1.6.0](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.7**

출시일: 2021년 8월 2일

</td>
<td>

* [AppleRunConfiguration에 Xcode 구성 옵션 추가](https://youtrack.jetbrains.com/issue/KTIJ-19054).
* [Apple M1 시뮬레이터 지원 추가](https://youtrack.jetbrains.com/issue/KT-47618).
* [프로젝트 마법사에 Xcode 통합 옵션 관련 정보 추가](https://youtrack.jetbrains.com/issue/KT-47466).
* [CocoaPods를 포함한 프로젝트가 생성되었으나 CocoaPods gem이 설치되지 않은 경우 오류 알림 추가](https://youtrack.jetbrains.com/issue/KT-47329).
* [Kotlin 1.5.30을 사용하여 생성된 공유 모듈에서 Apple M1 시뮬레이터 타겟 지원 추가](https://youtrack.jetbrains.com/issue/KT-47631).
* [Kotlin 1.5.20으로 생성된 Xcode 프로젝트 정리](https://youtrack.jetbrains.com/issue/KT-47465).
* 실제 iOS 기기에서 Xcode Release 구성 실행 문제 수정.
* Xcode 12.5를 사용한 시뮬레이터 실행 문제 수정.

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.6**

출시일: 2021년 6월 10일

</td>
<td>

* Android Studio Bumblebee Canary 1과의 호환성.
* [Kotlin 1.5.20](https://kotlinlang.org/docs/whatsnew1520.html) 지원: 프로젝트 마법사에서 Kotlin/Native를 위한 새로운 프레임워크 패킹 태스크 사용.

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.5**

출시일: 2021년 5월 25일

</td>
<td>

* [Android Studio Arctic Fox 2020.3.1 Beta 1 이상과의 호환성 수정](https://youtrack.jetbrains.com/issue/KT-46834).

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.4**

출시일: 2021년 5월 5일

</td>
<td>

이 버전의 플러그인은 Android Studio 4.2 또는 Android Studio 2020.3.1 Canary 8 이상에서 사용하세요.
* [Kotlin 1.5.0](https://kotlinlang.org/docs/whatsnew15.html)과의 호환성.
* [iOS 통합을 위해 Kotlin Multiplatform 모듈에서 CocoaPods 종속성 관리자 사용 기능 추가](https://youtrack.jetbrains.com/issue/KT-45946).

</td>
<td>

[Kotlin 1.5.0](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.3**

출시일: 2021년 4월 5일

</td>
<td>

* [프로젝트 마법사: 모듈 명명 규칙 개선](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282).
* [iOS 통합을 위해 프로젝트 마법사에서 CocoaPods 종속성 관리자 사용 기능 추가](https://youtrack.jetbrains.com/issue/KT-45478).
* [새 프로젝트의 gradle.properties 가독성 개선](https://youtrack.jetbrains.com/issue/KT-42908).
* ["Add sample tests for Shared Module"을 체크 해제하면 샘플 테스트가 더 이상 생성되지 않음](https://youtrack.jetbrains.com/issue/KT-43441).
* [기타 수정 및 개선 사항](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25).

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.2**

출시일: 2021년 3월 3일

</td>
<td>

* [Xcode 관련 파일을 Xcode에서 열 수 있는 기능](https://youtrack.jetbrains.com/issue/KT-44970).
* [iOS 실행 구성에서 Xcode 프로젝트 파일 위치 설정 기능](https://youtrack.jetbrains.com/issue/KT-44968).
* [Android Studio 2020.3.1 Canary 8 지원](https://youtrack.jetbrains.com/issue/KT-45162).
* [기타 수정 및 개선 사항](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20).

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.1**

출시일: 2021년 2월 15일

</td>
<td>

이 버전의 플러그인은 Android Studio 4.2에서 사용하세요.
* 인프라 개선.
* [기타 수정 및 개선 사항](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20).

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.0**

출시일: 2020년 11월 23일

</td>
<td>

* [iPad 기기 지원](https://youtrack.jetbrains.com/issue/KT-41932).
* [Xcode에 구성된 커스텀 스킴 이름 지원](https://youtrack.jetbrains.com/issue/KT-41677).
* [iOS 실행 구성을 위한 커스텀 빌드 단계 추가 기능](https://youtrack.jetbrains.com/issue/KT-41678).
* [커스텀 Kotlin/Native 바이너리 디버깅 기능](https://youtrack.jetbrains.com/issue/KT-40954).
* [Kotlin Multiplatform Mobile 마법사에서 생성되는 코드 단순화](https://youtrack.jetbrains.com/issue/KT-41712).
* [Kotlin Android Extensions 플러그인 지원 제거](https://youtrack.jetbrains.com/issue/KT-42121) (Kotlin 1.4.20에서 지원 중단됨).
* [호스트와 연결 해제 후 물리 기기 구성 저장 문제 수정](https://youtrack.jetbrains.com/issue/KT-42390).
* 기타 수정 및 개선 사항.

</td>
<td>

[Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.3**

출시일: 2020년 10월 2일

</td>
<td>

* iOS 14 및 Xcode 12 호환성 추가.
* Kotlin Multiplatform Mobile 마법사에서 생성된 플랫폼 테스트의 명명 규칙 수정.

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.2**

출시일: 2020년 9월 29일

</td>
<td>

 * [Kotlin 1.4.20-M1](https://kotlinlang.org/docs/eap.html#build-details)과의 호환성 수정.
 * 기본적으로 JetBrains로 오류 보고를 보내도록 설정.

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.1**

출시일: 2020년 9월 10일

</td>
<td>

* Android Studio Canary 8 이상과의 호환성 수정.

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.0**

출시일: 2020년 8월 31일

</td>
<td>

* Kotlin Multiplatform Mobile 플러그인의 첫 번째 버전. 자세한 내용은 [블로그 포스트](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/)를 확인하세요.

</td>
<td>

* [Kotlin 1.4.0](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

</table>