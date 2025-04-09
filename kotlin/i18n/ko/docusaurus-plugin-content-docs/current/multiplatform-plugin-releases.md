---
title: "Kotlin Multiplatform 플러그인 릴리스"
---
Android Studio에서 Kotlin Multiplatform 프로젝트를 계속 작업하려면 최신 버전의 [Kotlin Multiplatform plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)이 설치되어 있는지 확인하세요.

## 새 릴리스로 업데이트

Android Studio는 새로운 Kotlin Multiplatform plugin 릴리스가 출시되는 즉시 업데이트를 제안합니다. 제안을 수락하면 플러그인이 자동으로 최신 버전으로 업데이트됩니다. 플러그인 설치를 완료하려면 Android Studio를 다시 시작해야 합니다.

**Settings/Preferences** | **Plugins**에서 플러그인 버전을 확인하고 수동으로 업데이트할 수 있습니다.

플러그인이 올바르게 작동하려면 호환되는 Kotlin 버전이 필요합니다. 호환되는 버전은 [릴리스 정보](#release-details)에서 확인할 수 있습니다. **Settings/Preferences** | **Plugins** 또는 **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates**에서 Kotlin 버전을 확인하고 업데이트할 수 있습니다.

:::note
호환되는 Kotlin 버전이 설치되어 있지 않으면 Kotlin Multiplatform plugin이 비활성화됩니다. Kotlin 버전을 업데이트한 다음 **Settings/Preferences** | **Plugins**에서 플러그인을 활성화해야 합니다.

:::

## 릴리스 정보

다음 표에는 최신 Kotlin Multiplatform plugin 릴리스에 대한 세부 정보가 나와 있습니다.
<table> 
<tr>
<th>
Release info
</th>
<th>
Release highlights
</th>
<th>
Compatible Kotlin version
</th>
</tr>
<tr>
<td>

**0.8.4**

Released: 2024년 12월 6일
</td>
<td>

* 향상된 안정성 및 코드 분석을 위해 Kotlin의 [K2 mode](k2-compiler-migration-guide#support-in-ides) 지원.
</td>
<td>

* [Kotlin plugin 버전](releases#release-details) 중 하나
</td>
</tr>
<tr>
<td>

**0.8.3**

Released: 2024년 7월 23일
</td>
<td>

* Xcode 호환성 문제 수정.
</td>
<td>

* [Kotlin plugin 버전](releases#release-details) 중 하나
</td>
</tr>
<tr>
<td>

**0.8.2**

Released: 2024년 5월 16일
</td>
<td>

* Android Studio Jellyfish 및 새로운 Canary 버전 Koala 지원.
* 공유 모듈에 `sourceCompatibility` 및 `targetCompatibility` 선언 추가.
</td>
<td>

* [Kotlin plugin 버전](releases#release-details) 중 하나
</td>
</tr>
<tr>
<td>

**0.8.1**

Released: 2023년 11월 9일
</td>
<td>

* Kotlin을 1.9.20으로 업데이트했습니다.
* Jetpack Compose를 1.5.4로 업데이트했습니다.
* Gradle 빌드 및 구성 캐시를 기본적으로 활성화했습니다.
* 새로운 Kotlin 버전에 대한 빌드 구성을 리팩터링했습니다.
* iOS 프레임워크가 이제 기본적으로 정적입니다.
* Xcode 15에서 iOS 장치에서 실행할 때 발생하는 문제를 수정했습니다.
</td>
<td>

* [Kotlin plugin 버전](releases#release-details) 중 하나
</td>
</tr>
<tr>
<td>

**0.8.0**

Released: 2023년 10월 5일
</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) Gradle version catalog로 마이그레이션되었습니다.
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) `android`를 `androidTarget`으로 이름을 변경했습니다.
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) Kotlin 및 종속성 버전을 업데이트했습니다.
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) `-sdk` 및 `-arch` 대신 `-destination` 인수를 사용하도록 리팩터링했습니다.
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 생성된 파일 이름을 리팩터링했습니다.
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) JVM 대상 구성을 추가했습니다.
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) Xcode 15.0을 지원합니다.
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 새로운 모듈 마법사를 실험적 상태로 옮겼습니다.
</td>
<td>

* [Kotlin plugin 버전](releases#release-details) 중 하나
</td>
</tr>
<tr>
<td>

**0.6.0**

Released: 2023년 5월 24일
</td>
<td>

* 새로운 Canary Android Studio Hedgehog 지원.
* Multiplatform 프로젝트에서 Kotlin, Gradle 및 라이브러리 버전을 업데이트했습니다.
* Multiplatform 프로젝트에서 새로운 [`targetHierarchy.default()`](whatsnew1820#new-approach-to-source-set-hierarchy)를 적용했습니다.
* Multiplatform 프로젝트에서 플랫폼별 파일에 소스 세트 이름 접미사를 적용했습니다.
</td>
<td>

* [Kotlin plugin 버전](releases#release-details) 중 하나
</td>
</tr>
<tr>
<td>

**0.5.3**

Released: 2023년 4월 12일
</td>
<td>

* Kotlin 및 Compose 버전을 업데이트했습니다.
* Xcode 프로젝트 스키마 구문 분석을 수정했습니다.
* 스키마 제품 유형 검사를 추가했습니다.
* `iosApp` 스키마가 있는 경우 기본적으로 선택됩니다.
</td>
<td>

* [Kotlin plugin 버전](releases#release-details) 중 하나
</td>
</tr>
<tr>
<td>

**0.5.2**

Released: 2023년 1월 30일
</td>
<td>

* [Kotlin/Native 디버거 문제 수정 (느린 Spotlight 인덱싱)](https://youtrack.jetbrains.com/issue/KT-55988).
* [멀티 모듈 프로젝트에서 Kotlin/Native 디버거 수정](https://youtrack.jetbrains.com/issue/KT-24450).
* [Android Studio Giraffe 2022.3.1 Canary에 대한 새로운 빌드](https://youtrack.jetbrains.com/issue/KT-55274).
* [iOS 앱 빌드에 대한 프로비저닝 플래그 추가](https://youtrack.jetbrains.com/issue/KT-55204).
* [생성된 iOS 프로젝트에서 **Framework Search Paths** 옵션에 상속된 경로 추가](https://youtrack.jetbrains.com/issue/KT-55402).
</td>
<td>

* [Kotlin plugin 버전](releases#release-details) 중 하나
</td>
</tr>
<tr>
<td>

**0.5.1**

Released: 2022년 11월 30일
</td>
<td>

* [새 프로젝트 생성 수정: 초과 "app" 디렉토리 삭제](https://youtrack.jetbrains.com/issue/KTIJ-23790).
</td>
<td>

* [Kotlin 1.7.0—*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.0**

Released: 2022년 11월 22일
</td>
<td>

* [iOS 프레임워크 배포에 대한 기본 옵션 변경: 이제 **Regular framework**입니다](https://youtrack.jetbrains.com/issue/KT-54086).
* [생성된 Android 프로젝트에서 `MyApplicationTheme`을 별도의 파일로 이동](https://youtrack.jetbrains.com/issue/KT-53991).
* [생성된 Android 프로젝트 업데이트](https://youtrack.jetbrains.com/issue/KT-54658).
* [새 프로젝트 디렉토리가 예기치 않게 지워지는 문제 수정](https://youtrack.jetbrains.com/issue/KTIJ-23707).
</td>
<td>

* [Kotlin 1.7.0—*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.4**

Released: 2022년 9월 12일
</td>
<td>

* [Android 앱을 Jetpack Compose로 마이그레이션](https://youtrack.jetbrains.com/issue/KT-53162).
* [더 이상 사용되지 않는 HMPP 플래그 제거](https://youtrack.jetbrains.com/issue/KT-52248).
* [Android 매니페스트에서 패키지 이름 제거](https://youtrack.jetbrains.com/issue/KTIJ-22633).
* [Xcode 프로젝트에 대한 `.gitignore` 업데이트](https://youtrack.jetbrains.com/issue/KT-53703).
* [expect/actual을 더 잘 보여주기 위해 마법사 프로젝트 업데이트](https://youtrack.jetbrains.com/issue/KT-53928).
* [Android Studio의 Canary 빌드와의 호환성 업데이트](https://youtrack.jetbrains.com/issue/KTIJ-22063).
* [Android 앱의 최소 Android SDK를 21로 업데이트](https://youtrack.jetbrains.com/issue/KTIJ-22505).
* [Xcode 설치 후 첫 번째 실행 문제 수정](https://youtrack.jetbrains.com/issue/KTIJ-22645).
* [M1에서 Apple 실행 구성 관련 문제 수정](https://youtrack.jetbrains.com/issue/KTIJ-21781).
* [Windows OS에서 `local.properties` 관련 문제 수정](https://youtrack.jetbrains.com/issue/KTIJ-22037).
* [Android Studio의 Canary 빌드에서 Kotlin/Native 디버거 관련 문제 수정](https://youtrack.jetbrains.com/issue/KT-53976).
</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.3**

Released: 2022년 6월 9일
</td>
<td>

* Kotlin IDE 플러그인 1.7.0에 대한 종속성 업데이트.
</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.2**

Released: 2022년 4월 4일
</td>
<td>

* Android Studio 2021.2 및 2021.3에서 iOS 애플리케이션 디버깅 성능 문제 수정.
</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.1**

Released: 2022년 2월 15일
</td>
<td>

* [Kotlin Multiplatform Mobile 마법사에서 M1 iOS 시뮬레이터 활성화](https://youtrack.jetbrains.com/issue/KT-51105).
* XcProject 인덱싱 성능 향상: [KT-49777](https://youtrack.jetbrains.com/issue/KT-49777), [KT-50779](https://youtrack.jetbrains.com/issue/KT-50779).
* 빌드 스크립트 정리: `kotlin("test-common")` 및 `kotlin("test-annotations-common")` 대신 `kotlin("test")` 사용.
* [Kotlin plugin version](https://youtrack.jetbrains.com/issue/KTIJ-20167)과의 호환성 범위 증가.
* [Windows 호스트에서 JVM 디버깅 문제 수정](https://youtrack.jetbrains.com/issue/KT-50699).
* [플러그인 비활성화 후 잘못된 버전 문제 수정](https://youtrack.jetbrains.com/issue/KT-50966).
</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.0**

Released: 2021년 11월 16일
</td>
<td>

* [새로운 Kotlin Multiplatform Library 마법사](https://youtrack.jetbrains.com/issue/KTIJ-19367).
* 새로운 유형의 Kotlin Multiplatform 라이브러리 배포 지원: [XCFramework](multiplatform-build-native-binaries#build-xcframeworks).
* 새로운 크로스 플랫폼 모바일 프로젝트에 대한 [계층적 프로젝트 구조](multiplatform-hierarchy#manual-configuration) 활성화.
* [명시적 iOS 대상 선언](https://youtrack.jetbrains.com/issue/KT-46861) 지원.
* [비 Mac 장치에서 Kotlin Multiplatform Mobile 플러그인 마법사 활성화](https://youtrack.jetbrains.com/issue/KT-48614).
* [Kotlin Multiplatform 모듈 마법사에서 하위 폴더 지원](https://youtrack.jetbrains.com/issue/KT-47923).
* [Xcode `Assets.xcassets` 파일 지원](https://youtrack.jetbrains.com/issue/KT-49571).
* [플러그인 클래스 로더 예외 수정](https://youtrack.jetbrains.com/issue/KT-48103).
* CocoaPods Gradle Plugin 템플릿 업데이트.
* Kotlin/Native 디버거 유형 평가 개선.
* Xcode 13으로 iOS 장치 실행 수정.
</td>
<td>

* [Kotlin 1.6.0](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.7**

Released: 2021년 8월 2일
</td>
<td>

* [AppleRunConfiguration에 대한 Xcode 구성 옵션 추가](https://youtrack.jetbrains.com/issue/KTIJ-19054).
* [Apple M1 시뮬레이터 지원 추가](https://youtrack.jetbrains.com/issue/KT-47618).
* [프로젝트 마법사에 Xcode 통합 옵션에 대한 정보 추가](https://youtrack.jetbrains.com/issue/KT-47466).
* [CocoaPods로 프로젝트가 생성되었지만 CocoaPods gem이 설치되지 않은 후 오류 알림 추가](https://youtrack.jetbrains.com/issue/KT-47329).
* [Kotlin 1.5.30으로 생성된 공유 모듈에서 Apple M1 시뮬레이터 대상 지원 추가](https://youtrack.jetbrains.com/issue/KT-47631).
* [Kotlin 1.5.20으로 생성된 Xcode 프로젝트 정리](https://youtrack.jetbrains.com/issue/KT-47465).
* 실제 iOS 장치에서 Xcode Release 구성 실행 수정.
* Xcode 12.5로 시뮬레이터 실행 수정.
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.6**

Released: 2021년 6월 10일
</td>
<td>

* Android Studio Bumblebee Canary 1과의 호환성.
* [Kotlin 1.5.20](whatsnew1520) 지원: 프로젝트 마법사에서 Kotlin/Native에 대한 새로운 프레임워크 패킹 작업 사용.
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.5**

Released: 2021년 5월 25일
</td>
<td>

* [Android Studio Arctic Fox 2020.3.1 Beta 1 이상과의 호환성 수정](https://youtrack.jetbrains.com/issue/KT-46834).
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.4**

Released: 2021년 5월 5일
</td>
<td>

Android Studio 4.2 또는 Android Studio 2020.3.1 Canary 8 이상에서 이 버전의 플러그인을 사용하십시오.
* [Kotlin 1.5.0](whatsnew15)과의 호환성.
* [iOS 통합을 위해 Kotlin Multiplatform 모듈에서 CocoaPods 종속성 관리자를 사용할 수 있는 기능](https://youtrack.jetbrains.com/issue/KT-45946).
</td>
<td>

* [Kotlin 1.5.0](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.3**

Released: 2021년 4월 5일
</td>
<td>

* [프로젝트 마법사: 모듈 이름 지정 개선](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282).
* [iOS 통합을 위해 프로젝트 마법사에서 CocoaPods 종속성 관리자를 사용할 수 있는 기능](https://youtrack.jetbrains.com/issue/KT-45478).
* [새 프로젝트에서 gradle.properties 가독성 향상](https://youtrack.jetbrains.com/issue/KT-42908).
* ["공유 모듈에 대한 샘플 테스트 추가"가 선택 해제된 경우 샘플 테스트가 더 이상 생성되지 않음](https://youtrack.jetbrains.com/issue/KT-43441).
* [수정 사항 및 기타 개선 사항](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25).
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.2**

Released: 2021년 3월 3일
</td>
<td>

* [Xcode 관련 파일을 Xcode에서 열 수 있는 기능](https://youtrack.jetbrains.com/issue/KT-44970).
* [iOS 실행 구성에서 Xcode 프로젝트 파일의 위치를 설정할 수 있는 기능](https://youtrack.jetbrains.com/issue/KT-44968).
* [Android Studio 2020.3.1 Canary 8 지원](https://youtrack.jetbrains.com/issue/KT-45162).
* [수정 사항 및 기타 개선 사항](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20).
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.1**

Released: 2021년 2월 15일
</td>
<td>

Android Studio 4.2에서 이 버전의 플러그인을 사용하십시오.
* 인프라 개선.
* [수정 사항 및 기타 개선 사항](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20).
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.0**

Released: 2020년 11월 23일
</td>
<td>

* [iPad 장치 지원](https://youtrack.jetbrains.com/issue/KT-41932).
* [Xcode에서 구성된 사용자 지정 스키마 이름 지원](https://youtrack.jetbrains.com/issue/KT-41677).
* [iOS 실행 구성에 대한 사용자 지정 빌드 단계를 추가할 수 있는 기능](https://youtrack.jetbrains.com/issue/KT-41678).
* [사용자 지정 Kotlin/Native 바이너리를 디버깅할 수 있는 기능](https://youtrack.jetbrains.com/issue/KT-40954).
* [Kotlin Multiplatform Mobile 마법사에서 생성된 코드 단순화](https://youtrack.jetbrains.com/issue/KT-41712).
* [Kotlin 1.4.20에서 더 이상 사용되지 않는 Kotlin Android Extensions 플러그인 지원 제거](https://youtrack.jetbrains.com/issue/KT-42121).
* [호스트에서 연결이 끊어진 후 물리적 장치 구성 저장 수정](https://youtrack.jetbrains.com/issue/KT-42390).
* 기타 수정 사항 및 개선 사항.
</td>
<td>

* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.3**

Released: 2020년 10월 2일
</td>
<td>

* iOS 14 및 Xcode 12와의 호환성이 추가되었습니다.
* Kotlin Multiplatform Mobile 마법사에서 생성된 플랫폼 테스트의 이름 지정 수정.
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.2**

Released: 2020년 9월 29일
</td>
<td>

 * [Kotlin 1.4.20-M1](eap#build-details)과의 호환성이 수정되었습니다.
 * 기본적으로 JetBrains에 오류 보고 활성화.
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.1**

Released: 2020년 9월 10일
</td>
<td>

* Android Studio Canary 8 이상과의 호환성이 수정되었습니다.
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.0**

Released: 2020년 8월 31일
</td>
<td>

* Kotlin Multiplatform Mobile 플러그인의 첫 번째 버전입니다. 자세한 내용은 [블로그 게시물](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/)을 참조하십시오.
</td>
<td>

* [Kotlin 1.4.0](releases#release-details)
* [Kotlin 1.4.10](releases#release-details)
</td>
</tr>
</table>