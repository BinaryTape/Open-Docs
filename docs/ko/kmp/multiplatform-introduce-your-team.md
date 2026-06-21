[//]: # (title: 팀에 멀티플랫폼 모바일 개발을 도입하는 방법)

<web-summary>원활하고 효율적인 도입을 위한 6가지 권장 사항과 함께 팀에 멀티플랫폼 모바일 앱 개발을 도입하는 방법을 알아보세요.</web-summary>

새로운 기술과 도구를 조직에 도입하는 것은 여러 도전 과제를 수반합니다. 워크플로를 최적화하고 효율화하기 위해 팀이 [모바일 앱 개발을 위한 멀티플랫폼 접근 방식](cross-platform-mobile-development.topic)을 채택하도록 어떻게 도울 수 있을까요? JetBrains가 개발한 오픈 소스 기술인 [Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)을 팀에 효과적으로 소개하는 데 도움이 될 몇 가지 권장 사항과 모범 사례를 소개합니다. KMP는 네이티브(native) 프로그래밍의 이점을 유지하면서 개발자가 플랫폼 간에 코드를 공유할 수 있도록 해줍니다.

* [공감으로 시작하기](#start-with-empathy)
* [Kotlin Multiplatform의 작동 방식 설명하기](#explain-how-kotlin-multiplatform-works)
* [사례 연구를 통해 멀티플랫폼 개발의 가치 입증하기](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
* [샘플 프로젝트를 만들어 증거 제시하기](#offer-proof-by-creating-a-sample-project)
* [팀의 멀티플랫폼 개발 관련 질문에 대비하기](#prepare-for-questions-about-multiplatform-development-from-your-team)
* [적응 기간 동안 팀 지원하기](#support-your-team-during-the-adaptation-period)

## 공감으로 시작하기

소프트웨어 개발은 팀 게임이며, 모든 중요한 결정에는 팀 구성원 전체의 동의가 필요합니다. 크로스 플랫폼(cross-platform) 기술을 통합하는 것은 모바일 애플리케이션의 개발 프로세스에 큰 영향을 미칩니다. 따라서 프로젝트에 Kotlin Multiplatform을 통합하기 전에, 팀에 기술을 소개하고 도입할 가치가 있다는 것을 부드럽게 안내해야 합니다.

프로젝트에서 함께 일하는 사람들을 이해하는 것이 성공적인 통합의 첫 번째 단계입니다. 관리자는 가능한 최단 시간 내에 최고의 품질로 기능을 제공할 책임이 있습니다. 그들에게 새로운 기술은 곧 위험(risk)입니다. 동료들 또한 다른 관점을 가지고 있습니다. 그들은 "네이티브" 기술 스택으로 앱을 빌드한 경험이 있습니다. UI와 비즈니스 로직을 작성하고, 의존성을 처리하고, IDE에서 코드를 테스트 및 디버깅하는 방법을 알고 있으며, 이미 특정 언어에 익숙합니다. 다른 생태계로 전환하는 것은 항상 불편한 일이며, 자신의 컴포트 존(comfort zone)을 벗어나는 것을 의미합니다.

이 모든 상황을 고려할 때, Kotlin Multiplatform으로의 전환을 주장할 때 많은 편견에 부딪히고 수많은 질문에 답할 준비가 되어 있어야 합니다. 이때 팀이 무엇을 필요로 하는지 절대로 놓치지 마세요. 아래의 조언들이 제안을 준비하는 데 도움이 될 것입니다.

## Kotlin Multiplatform의 작동 방식 설명하기

이 단계에서는 Kotlin Multiplatform을 사용하는 것이 프로젝트에 가치를 더할 수 있다는 점을 보여주고, 팀이 가질 수 있는 크로스 플랫폼 모바일 애플리케이션에 대한 편견과 의심을 제거해야 합니다.

KMP는 Alpha 출시 이후 프로덕션 환경에서 널리 사용되어 왔습니다. 그 결과 JetBrains는 광범위한 피드백을 수집하여 [Stable(안정화) 버전](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)에서 더욱 향상된 개발 경험을 제공할 수 있게 되었습니다.

* **모든 iOS 및 Android 기능 사용 가능** – 공유 코드에서 작업을 수행할 수 없거나 특정 네이티브 기능을 사용하고 싶을 때마다, [expect/actual](multiplatform-expect-actual.md) 패턴을 사용하여 플랫폼 전용 코드를 원활하게 작성할 수 있습니다.
* **매끄러운 성능** – Kotlin으로 작성된 공유 코드는 대상 플랫폼에 따라 다른 출력 형식으로 컴파일됩니다. Android의 경우 Java 바이트코드(bytecode)로, iOS의 경우 네이티브 바이너리(native binaries)로 컴파일됩니다. 따라서 플랫폼에서 이 코드를 실행할 때 추가적인 런타임 오버헤드가 없으며 성능은 [네이티브 앱](native-and-cross-platform.topic)과 대등합니다.
* **기존 코드와의 호환성** – 프로젝트 규모에 상관없이 기존 코드가 Kotlin Multiplatform 통합을 방해하지 않습니다. 언제든지 크로스 플랫폼 코드 작성을 시작하여 기존 iOS 및 Android 앱에 일반적인 의존성으로 연결할 수 있으며, 이미 작성된 코드를 수정하여 iOS와 호환되도록 만들 수도 있습니다.

기술이 *어떻게* 작동하는지 설명할 수 있는 능력은 매우 중요합니다. 논의가 마치 마법에 의존하는 것처럼 보이는 것을 좋아하는 사람은 아무도 없기 때문입니다. 명확하지 않은 부분이 있으면 사람들은 최악의 상황을 가정할 수 있으므로, 어떤 내용이 너무 당연해서 설명할 필요가 없다고 생각하는 실수를 범하지 않도록 주의하세요. 대신, 다음 단계로 넘어가기 전에 모든 기본 개념을 설명하려고 노력하세요. [멀티플랫폼 프로그래밍](get-started.topic)에 관한 이 문서는 지식을 체계화하여 준비하는 데 도움이 될 것입니다.

## 사례 연구를 통해 멀티플랫폼 개발의 가치 입증하기

멀티플랫폼 기술의 작동 방식을 이해하는 것도 필요하지만, 그것만으로는 충분하지 않습니다. 팀은 이를 사용함으로써 얻는 이득을 확인해야 하며, 이러한 이득을 제시하는 방식은 제품과 관련이 있어야 합니다.

이 단계에서는 제품에 Kotlin Multiplatform을 도입했을 때의 주요 이점을 설명해야 합니다. 한 가지 방법은 이미 크로스 플랫폼 모바일 개발의 혜택을 누리고 있는 다른 회사들의 이야기를 공유하는 것입니다. 이러한 팀들의 성공적인 경험, 특히 유사한 제품 목표를 가진 팀들의 사례는 최종 결정에 핵심적인 요소가 될 수 있습니다.

이미 프로덕션에서 Kotlin Multiplatform을 사용 중인 여러 회사의 사례 연구를 인용하는 것이 설득력 있는 주장을 펼치는 데 큰 도움이 될 수 있습니다.

* **McDonald's** – 글로벌 모바일 앱에 Kotlin Multiplatform을 활용하여 McDonald's는 플랫폼 간에 공유할 수 있는 코드베이스(codebase)를 구축하여 코드 중복의 필요성을 제거했습니다.
* **Netflix** – Kotlin Multiplatform의 도움으로 Netflix는 제품의 신뢰성과 배포 속도를 최적화하고 있으며, 이는 고객의 요구를 충족하는 데 매우 중요합니다.
* **Forbes** – iOS와 Android 간에 로직의 80% 이상을 공유함으로써, Forbes는 플랫폼별 맞춤 설정을 위한 유연성을 유지하면서 두 플랫폼 모두에 신규 기능을 동시에 출시하고 있습니다.
* **9GAG** – Flutter와 React Native를 모두 시도해 본 후, 9GAG는 점진적으로 Kotlin Multiplatform을 도입했습니다. 현재 이를 통해 사용자에게 일관된 경험을 제공하면서 기능을 더 빠르게 출시하고 있습니다.

[![Kotlin Multiplatform 성공 사례로부터 배우기](kmp-success-stories.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

## 샘플 프로젝트를 만들어 증거 제시하기

이론도 좋지만, 결국 이를 실행에 옮기는 것이 가장 중요합니다. 주장에 설득력을 더하고 멀티플랫폼 모바일 앱 개발의 잠재력을 보여주기 위한 한 가지 방법으로, 시간을 할애하여 Kotlin Multiplatform으로 무언가를 만든 다음 그 결과를 팀원들과 논의하는 자리를 마련할 수 있습니다. 프로토타입(prototype)은 애플리케이션에 필요한 기능을 시연하는, 처음부터 직접 작성한 일종의 테스트 프로젝트가 될 수 있습니다.
[Ktor 및 SQLDelight를 사용한 멀티플랫폼 앱 만들기 – 튜토리얼](multiplatform-ktor-sqldelight.md)이 이 과정을 잘 안내해 줄 것입니다.

현재 프로젝트를 실험해 봄으로써 더욱 관련성 높은 예시를 만들어낼 수도 있습니다.
Kotlin으로 구현된 기존 기능 하나를 골라 크로스 플랫폼으로 만들거나, 
기존 프로젝트에 새로운 멀티플랫폼 모듈(Multiplatform Module)을 만들고 
백로그(backlog) 하단에 있는 우선순위가 낮은 기능을 골라 공유 모듈에서 구현해 볼 수도 있습니다.
[Android 애플리케이션을 iOS에서 작동하게 만들기 – 튜토리얼](multiplatform-integrate-in-existing-app.md)에서 샘플 프로젝트를 기반으로 한 단계별 가이드를 제공합니다.

## 팀의 멀티플랫폼 개발 관련 질문에 대비하기

제안이 아무리 상세하더라도 팀원들은 많은 질문을 던질 것입니다. 주의 깊게 듣고 인내심을 가지고 모든 질문에 답해 보세요. 질문의 대부분은 일상적인 개발 루틴에서 Kotlin을 보는 데 익숙하지 않은 iOS 팀원들로부터 나올 수 있습니다. 다음은 가장 일반적인 질문 목록으로, 답변 준비에 도움이 될 것입니다.

### Q: 크로스 플랫폼 기술 기반의 애플리케이션은 App Store에서 거부될 수 있다고 들었습니다. 이런 위험을 감수할 가치가 있나요?

A: Apple Store에는 앱 게시를 위한 엄격한 가이드라인이 있습니다. 제한 사항 중 하나는 앱의 기능이나 특징을 도입하거나 변경하는 코드를 앱이 다운로드, 설치 또는 실행할 수 없다는 것입니다([App Store Review Guideline 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)). 이는 일부 크로스 플랫폼 기술에는 해당될 수 있지만, Kotlin Multiplatform에는 해당되지 않습니다. 공유된 Kotlin 코드는 Kotlin/Native를 통해 네이티브 바이너리로 컴파일되어 일반적인 iOS 프레임워크로 앱에 포함되며, 동적인 코드 실행 기능을 제공하지 않습니다.

### Q: 멀티플랫폼 프로젝트는 Gradle로 빌드되는데, Gradle은 학습 곡선이 매우 가파릅니다. 이제 프로젝트 설정에 많은 시간을 할애해야 한다는 뜻인가요? {id="gradle-time-spent"}

A: 실제로는 그럴 필요가 없습니다. Kotlin 모바일 애플리케이션 빌드를 위한 작업 프로세스를 구성하는 방법은 다양합니다. 첫째, Android 개발자만 빌드를 담당할 수 있습니다. 이 경우 iOS 팀은 코드만 작성하거나 생성된 결과물(artifact)만 사용할 수도 있습니다. 또한 Gradle 작업이 필요한 업무를 처리할 때 워크숍을 열거나 페어 프로그래밍(pair programming)을 진행하여 팀의 Gradle 기술을 향상시킬 수도 있습니다. 멀티플랫폼 프로젝트를 위한 다양한 팀 협업 방식을 살펴보고 팀에 가장 적합한 방식을 선택할 수 있습니다.

Android 팀원들만 공유 코드를 다룰 때는 iOS 개발자들이 Kotlin을 배울 필요조차 없습니다. 하지만 팀이 다음 단계로 나아가 모두가 공유 코드에 기여할 준비가 되었을 때, 전환하는 데는 많은 시간이 걸리지 않을 것입니다. Swift와 Kotlin의 구문(syntax) 및 기능적 유사성 덕분에 공유 Kotlin 코드를 읽고 쓰는 법을 배우는 데 필요한 노력이 크게 줄어듭니다. [Kotlin Koans를 통해 직접 시도해 보세요](https://play.kotlinlang.org/koans/overview). Kotlin 구문과 주요 관용구(idioms)에 익숙해질 수 있는 일련의 연습 문제입니다.

2023년 말, JetBrains는 사용성, 온보딩 및 IDE 지원에 중점을 둔 새로운 실험적 프로젝트 구성 도구인 [Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/)를 도입했습니다. Amper의 기능에 대해 더 자세히 알아보려면 [튜토리얼](amper.md)을 참고하세요.

### Q: Kotlin Multiplatform은 프로덕션에서 사용할 준비가 되었나요?

A: 2023년 11월, Kotlin Multiplatform이 이제 [Stable(안정화)](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/) 단계에 접어들었음을 발표했습니다. 이는 이제 프로덕션 환경에서 안심하고 사용할 수 있음을 의미합니다.

### Q: 앱의 비즈니스 로직을 구현하기 위한 멀티플랫폼 라이브러리가 충분하지 않고, 네이티브 대안을 찾는 것이 훨씬 쉽습니다. 왜 Kotlin Multiplatform을 선택해야 하나요? {id="not-enough-libraries"}

A: Kotlin Multiplatform 생태계는 번창하고 있으며 전 세계의 많은 Kotlin 개발자들에 의해 가꾸어지고 있습니다. 수년에 걸쳐 KMP 라이브러리 수가 얼마나 빠르게 증가했는지 확인해 보세요.

![연도별 Kotlin Multiplatform 라이브러리 수](kmp-libraries-over-years.png){width=700}

또한 지금은 Kotlin Multiplatform 오픈 소스 커뮤니티에서 iOS 개발자가 활동하기에 아주 좋은 시기입니다. iOS 경험에 대한 수요가 많고, iOS 전용 기여를 통해 인지도를 얻을 수 있는 기회가 풍부하기 때문입니다.

팀이 멀티플랫폼 모바일 개발을 더 깊이 파고들수록 질문은 더 흥미롭고 복잡해질 것입니다. 답을 모른다고 걱정하지 마세요. Kotlin Slack에는 대규모의 지원적인 Kotlin Multiplatform 커뮤니티가 있으며, 이미 이를 사용 중인 많은 개발자가 도움을 줄 수 있는 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) 채널이 마련되어 있습니다. 팀에서 가장 많이 나온 질문들을 [저희와 공유](mailto:kotlin.multiplatform.feedback@kotlinlang.org)해 주시면 매우 감사하겠습니다. 이 정보는 문서에서 어떤 주제를 다루어야 할지 이해하는 데 도움이 됩니다. 

## 적응 기간 동안 팀 지원하기

Kotlin Multiplatform을 사용하기로 결정한 후에는 팀이 기술을 실험하는 적응 기간이 이어집니다. 그리고 여러분의 임무는 아직 끝나지 않았습니다! 팀원들에게 지속적인 지원을 제공함으로써 팀이 기술에 몰입하고 첫 성과를 거두는 데 걸리는 시간을 단축할 수 있습니다.

이 단계에서 팀을 지원할 수 있는 몇 가지 팁은 다음과 같습니다.

* 이전 단계에서 받았던 질문들을 "Kotlin Multiplatform: 자주 묻는 질문(FAQ)" 위키 페이지에 정리하여 팀과 공유하세요.
* _#kotlin-multiplatform-support_ Slack 채널을 만들고 그곳에서 가장 활발한 사용자가 되세요.
* 팝콘과 피자를 곁들인 비공식 팀 빌딩 이벤트를 열어 Kotlin Multiplatform에 관한 교육용 또는 영감을 주는 영상을 함께 시청하세요. 다음은 추천 영상 목록입니다.
   * [KMP 시작하기: 공유 로직과 네이티브 UI로 iOS 및 Android 앱 빌드하기](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu) 
   * [Compose Multiplatform으로 iOS, Android 및 데스크톱 앱 빌드하기](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97) 
   * [Kotlin Multiplatform을 활용한 iOS 개발: 팁과 요령](https://www.youtube.com/watch?v=eFzy1BRtHps) 
   * [팀을 위한 Kotlin Multiplatform - Kevin Galligan](https://www.youtube.com/watch?v=-tJvCOfJesk)

현실적으로 사람들의 마음과 생각을 하루나 일주일 만에 바꿀 수는 없을 것입니다. 하지만 인내심을 갖고 동료들의 요구 사항에 귀를 기울인다면 분명히 결실을 맺을 것입니다. 

JetBrains 팀은 [Kotlin Multiplatform 사용 경험에 대한 여러분의 이야기](mailto:kotlin.multiplatform.feedback@kotlinlang.org)를 기다리고 있습니다.

_이 글을 작성하는 데 도움을 주신 [Touchlab 팀](https://touchlab.co)에 감사의 말씀을 전합니다._