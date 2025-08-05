[//]: # (title: 팀에 멀티플랫폼 모바일 개발을 도입하는 방법)

<web-summary>팀에 멀티플랫폼 모바일 앱 개발을 도입하는 방법을 매끄럽고 효율적인 채택을 위한 6가지 권장 사항과 함께 알아보세요.</web-summary>

조직에 새로운 기술과 도구를 도입하는 것은 여러 가지 어려움을 수반합니다. 워크플로우를 최적화하고 간소화하기 위해 팀이 [모바일 앱 개발을 위한 멀티플랫폼 접근 방식](cross-platform-mobile-development.md)을 채택하도록 어떻게 도울 수 있을까요? 다음은 JetBrains가 개발한 오픈 소스 기술로, 개발자가 네이티브 프로그래밍의 이점을 유지하면서 플랫폼 간에 코드를 공유할 수 있게 해주는 [Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)를 팀에 효과적으로 소개하는 데 도움이 되는 몇 가지 권장 사항과 모범 사례입니다.

*   [공감부터 시작하세요](#start-with-empathy)
*   [Kotlin Multiplatform의 작동 방식 설명](#explain-how-kotlin-multiplatform-works)
*   [멀티플랫폼 개발의 가치를 보여주기 위한 사례 연구 활용](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
*   [샘플 프로젝트를 만들어 증명하세요](#offer-proof-by-creating-a-sample-project)
*   [팀의 멀티플랫폼 개발 관련 질문에 대비하세요](#prepare-for-questions-about-multiplatform-development-from-your-team)
*   [적응 기간 동안 팀 지원](#support-your-team-during-the-adaptation-period)

## 공감부터 시작하세요

소프트웨어 개발은 모든 팀원의 승인이 필요한 중요한 결정을 내려야 하는 팀 게임입니다. 어떤 크로스 플랫폼 기술이든 통합하면 모바일 애플리케이션 개발 프로세스에 상당한 영향을 미칩니다. 따라서 프로젝트에 Kotlin Multiplatform를 통합하기 전에 팀에 이 기술을 소개하고 채택할 가치가 있음을 부드럽게 안내해야 합니다.

프로젝트에 참여하는 사람들을 이해하는 것이 성공적인 통합의 첫걸음입니다. 상사는 최단 시간 내에 최고의 품질로 기능을 제공해야 하는 책임이 있습니다. 그들에게 어떤 새로운 기술도 위험으로 다가올 수 있습니다. 동료들 또한 다른 관점을 가지고 있습니다. 그들은 "네이티브" 기술 스택으로 앱을 구축한 경험이 있습니다. 그들은 UI와 비즈니스 로직을 작성하고, 의존성을 다루고, IDE에서 코드를 테스트하고 디버그하는 방법을 알고 있으며, 이미 언어에 익숙합니다. 다른 생태계로 전환하는 것은 항상 불편하며, 이는 항상 익숙한 환경을 벗어나는 것을 의미합니다.

이 모든 것을 고려할 때, Kotlin Multiplatform로의 전환을 옹호할 때 많은 편견에 부딪히고 수많은 질문에 답할 준비를 해야 합니다. 그렇게 하면서 팀의 요구사항을 절대 잊지 마세요. 아래의 조언 중 일부는 당신의 발표를 준비하는 데 유용할 수 있습니다.

## Kotlin Multiplatform의 작동 방식 설명

이 단계에서는 Kotlin Multiplatform를 사용하는 것이 프로젝트에 가치를 가져다줄 수 있으며, 팀이 가질 수 있는 크로스 플랫폼 모바일 애플리케이션에 대한 편향된 의견과 의구심을 해소할 수 있음을 보여주어야 합니다.

KMP는 알파 릴리스 이후 프로덕션에서 널리 사용되어 왔습니다. 그 결과, JetBrains는 광범위한 피드백을 수집하여 [Stable 버전](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)에서 훨씬 더 나은 개발 경험을 제공할 수 있었습니다.

*   **모든 iOS 및 Android 기능 사용 가능** – 공유 코드에서 작업을 완료할 수 없거나 특정 네이티브 기능을 사용하고 싶을 때마다 [expect/actual](multiplatform-expect-actual.md) 패턴을 사용하여 플랫폼별 코드를 원활하게 작성할 수 있습니다.
*   **원활한 성능** – Kotlin으로 작성된 공유 코드는 Android용 Java 바이트코드와 iOS용 네이티브 바이너리 등 다양한 대상에 대해 다른 출력 형식으로 컴파일됩니다. 따라서 플랫폼에서 이 코드를 실행할 때 추가적인 런타임 오버헤드가 없으며, 성능은 [네이티브 앱](native-and-cross-platform.md)과 비견됩니다.
*   **레거시 코드와의 호환성** – 프로젝트의 규모가 아무리 크더라도 기존 코드가 Kotlin Multiplatform 통합을 방해하지 않습니다. 언제든지 크로스 플랫폼 코드 작성을 시작하고 이를 iOS 및 Android 앱에 일반적인 의존성으로 연결하거나, 이미 작성한 코드를 사용하여 iOS와 호환되도록 수정할 수 있습니다.

기술이 _어떻게_ 작동하는지 설명할 수 있는 것은 매우 중요합니다. 아무도 논의가 마법에 의존하는 것처럼 보이는 것을 좋아하지 않기 때문입니다. 사람들은 무엇이든 불분명하면 최악을 생각할 수 있으므로, 너무 당연하다고 생각하여 설명을 생략하는 실수를 하지 않도록 주의해야 합니다. 대신, 다음 단계로 넘어가기 전에 모든 기본 개념을 설명하려고 노력하세요. [멀티플랫폼 프로그래밍](get-started.topic)에 대한 이 문서는 이러한 경험에 대비하여 지식을 체계화하는 데 도움이 될 수 있습니다.

## 멀티플랫폼 개발의 가치를 보여주기 위한 사례 연구 활용

멀티플랫폼 기술이 어떻게 작동하는지 이해하는 것은 필요하지만, 그것만으로는 충분하지 않습니다. 팀은 이 기술을 사용함으로써 얻는 이점을 보아야 하며, 이 이점을 제시하는 방식은 당신의 제품과 관련되어야 합니다.

이 단계에서는 제품에 Kotlin Multiplatform를 사용하는 주요 이점을 설명해야 합니다. 한 가지 방법은 이미 크로스 플랫폼 모바일 개발로 이점을 얻고 있는 다른 회사들의 이야기를 공유하는 것입니다. 이들 팀의 성공적인 경험, 특히 유사한 제품 목표를 가진 팀의 경험은 최종 결정의 핵심 요소가 될 수 있습니다.

이미 프로덕션에서 Kotlin Multiplatform를 사용하는 다양한 회사의 사례 연구를 인용하는 것은 설득력 있는 주장을 펼치는 데 크게 도움이 될 수 있습니다.

*   **McDonald's** – McDonald's는 글로벌 모바일 앱에 Kotlin Multiplatform를 활용하여 플랫폼 간에 공유될 수 있는 코드베이스를 구축함으로써 코드베이스 중복의 필요성을 제거했습니다.
*   **Netflix** – Kotlin Multiplatform의 도움으로 Netflix는 제품 안정성과 배포 속도를 최적화하여 고객의 요구사항을 충족시키는 데 중요한 역할을 합니다.
*   **Forbes** – iOS와 Android 간에 80% 이상의 로직을 공유함으로써 Forbes는 이제 플랫폼별 맞춤화에 대한 유연성을 유지하면서도 두 플랫폼에 새로운 기능을 동시에 출시합니다.
*   **9GAG** – Flutter와 React Native를 모두 시도한 후, 9GAG는 점진적으로 Kotlin Multiplatform를 채택했으며, 이는 이제 사용자에게 일관된 경험을 제공하면서 기능을 더 빠르게 제공하는 데 도움이 됩니다.

[![Learn from Kotlin Multiplatform success stories](kmp-success-stories.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

## 샘플 프로젝트를 만들어 증명하세요

이론은 좋지만, 궁극적으로는 실천이 가장 중요합니다. 당신의 주장을 더욱 설득력 있게 만들고 멀티플랫폼 모바일 앱 개발의 잠재력을 보여줄 수 있는 한 가지 방법은 Kotlin Multiplatform를 사용하여 무언가를 만들고 그 결과를 팀이 논의하도록 가져오는 것입니다. 당신의 프로토타입은 애플리케이션에 필요한 기능을 시연할 수 있는 일종의 테스트 프로젝트로, 처음부터 작성할 수 있습니다. [Ktor 및 SQLDelight를 사용하여 멀티플랫폼 앱 만들기 – 튜토리얼](multiplatform-ktor-sqldelight.md)이 이 과정에 잘 안내해 드릴 것입니다.

현재 프로젝트로 실험하여 더 관련성 있는 예시를 만들 수 있습니다. Kotlin으로 구현된 기존 기능 중 하나를 가져와 크로스 플랫폼으로 만들거나, 기존 프로젝트에 새로운 멀티플랫폼 모듈을 생성하고, 백로그의 하단에 있는 비우선순위 기능을 가져와 공유 모듈에 구현할 수도 있습니다. [Android 애플리케이션이 iOS에서 작동하도록 만들기 – 튜토리얼](multiplatform-integrate-in-existing-app.md)은 샘플 프로젝트를 기반으로 단계별 가이드를 제공합니다.

## 팀의 멀티플랫폼 개발 관련 질문에 대비하세요

아무리 상세하게 발표하더라도 팀은 많은 질문을 할 것입니다. 주의 깊게 듣고 모든 질문에 인내심을 가지고 답하려고 노력하세요. 대부분의 질문은 iOS 팀에서 나올 것으로 예상할 수 있는데, 이는 그들이 일상적인 개발 루틴에서 Kotlin을 보는 데 익숙하지 않은 개발자들이기 때문입니다. 가장 일반적인 질문 목록이 도움이 될 수 있습니다.

### Q: 크로스 플랫폼 기술 기반의 애플리케이션은 앱 스토어에서 거부될 수 있다고 들었습니다. 이 위험을 감수할 가치가 있나요?

A: Apple Store는 애플리케이션 게시를 위한 엄격한 가이드라인을 가지고 있습니다. 제한 사항 중 하나는 앱이 앱의 기능이나 특징을 도입하거나 변경하는 코드를 다운로드, 설치 또는 실행할 수 없다는 것입니다 ([App Store 검토 가이드라인 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)). 이는 일부 크로스 플랫폼 기술에는 해당되지만, Kotlin Multiplatform에는 해당되지 않습니다. 공유된 Kotlin 코드는 Kotlin/Native로 네이티브 바이너리로 컴파일되며, 일반적인 iOS 프레임워크를 앱에 번들링하고, 동적 코드 실행 기능을 제공하지 않습니다.

### Q: 멀티플랫폼 프로젝트는 Gradle로 빌드되는데, Gradle은 학습 곡선이 매우 가파릅니다. 이는 이제 프로젝트를 구성하는 데 많은 시간을 할애해야 한다는 의미인가요? {id="gradle-time-spent"}

A: 사실 그럴 필요 없습니다. Kotlin 모바일 애플리케이션 빌드와 관련된 작업 프로세스를 구성하는 방법은 다양합니다. 첫째, Android 개발자만이 빌드를 담당할 수 있으며, 이 경우 iOS 팀은 코드만 작성하거나 결과 아티팩트를 소비하기만 하면 됩니다. 또한 Gradle 작업이 필요한 작업을 처리할 때 워크숍을 조직하거나 짝 프로그래밍을 연습하여 팀의 Gradle 기술을 향상시킬 수 있습니다.

멀티플랫폼 프로젝트를 위한 팀워크 조직의 다양한 방법을 탐색하고 팀에 가장 적합한 방식을 선택할 수 있습니다.

팀의 Android 부분만 공유 코드를 작업할 때, iOS 개발자는 Kotlin을 배울 필요조차 없습니다. 그러나 팀이 모든 사람이 공유 코드에 기여하는 다음 단계로 나아갈 준비가 되면, 전환에는 많은 시간이 걸리지 않을 것입니다. Swift와 Kotlin의 문법 및 기능 간의 유사성은 공유 Kotlin 코드를 읽고 쓰는 방법을 배우는 데 필요한 노력을 크게 줄여줍니다. Kotlin 문법과 일부 관용구를 익히기 위한 일련의 연습 문제인 [Kotlin Koans로 직접 시도해보세요](https://play.kotlinlang.org/koans/overview).

2023년 말, JetBrains는 사용성, 온보딩 및 IDE 지원에 중점을 둔 새로운 실험적인 프로젝트 구성 도구인 [Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/)를 소개했습니다. Amper의 기능에 대한 더 많은 정보를 얻으려면 [튜토리얼](amper.md)을 살펴보세요.

### Q: Kotlin Multiplatform는 프로덕션 준비가 되었나요?

A: 2023년 11월, 저희는 Kotlin Multiplatform가 이제 [Stable](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/) 상태라고 발표했습니다. 이는 이제 프로덕션에서 완전히 사용할 준비가 되었다는 의미입니다.

### Q: 앱의 비즈니스 로직을 구현하기에 멀티플랫폼 라이브러리가 충분하지 않고, 네이티브 대안을 찾는 것이 훨씬 쉽습니다. 왜 Kotlin Multiplatform를 선택해야 하나요? {id="not-enough-libraries"}

A: Kotlin Multiplatform 생태계는 전 세계 많은 Kotlin 개발자들에 의해 번성하고 육성되고 있습니다. KMP 라이브러리 수가 수년간 얼마나 빠르게 성장해왔는지 살펴보세요.

![The number of Kotlin Multiplatform libraries over years](kmp-libraries-over-years.png){width=700}

또한, iOS 경험이 수요가 많고 iOS 특정 기여에 대한 인정을 받을 기회가 많기 때문에 Kotlin Multiplatform 오픈 소스 커뮤니티에서 iOS 개발자가 되기에도 좋은 시기입니다.

팀이 멀티플랫폼 모바일 개발에 더 깊이 파고들수록 질문은 더욱 흥미롭고 복잡해질 것입니다. 답을 모른다고 걱정하지 마세요. Kotlin Multiplatform는 Kotlin Slack에 크고 지원적인 커뮤니티를 가지고 있으며, 이미 이 기술을 사용하는 많은 개발자들이 도움을 줄 수 있는 전용 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) 채널이 있습니다. 팀에서 가장 많이 받은 질문들을 [저희와 공유해주시면](mailto:kotlin.multiplatform.feedback@kotlinlang.org) 매우 감사하겠습니다. 이 정보는 문서에서 다루어야 할 주제를 이해하는 데 도움이 될 것입니다.

## 적응 기간 동안 팀 지원

Kotlin Multiplatform를 사용하기로 결정한 후에는 팀이 기술을 실험하는 적응 기간이 있을 것입니다. 그리고 당신의 임무는 아직 끝나지 않았습니다! 팀원들에게 지속적인 지원을 제공함으로써, 팀이 기술에 몰입하고 첫 결과물을 달성하는 데 걸리는 시간을 줄일 수 있습니다.

다음은 이 단계에서 팀을 지원할 수 있는 몇 가지 팁입니다.

*   이전 단계에서 받았던 질문들을 "Kotlin Multiplatform: 자주 묻는 질문" 위키 페이지에 모아 팀과 공유하세요.
*   _#kotlin-multiplatform-support_ Slack 채널을 만들고 그곳에서 가장 활동적인 사용자가 되세요.
*   팝콘과 피자를 함께 하며 Kotlin Multiplatform에 대한 교육적 또는 영감을 주는 영상을 시청하는 비공식 팀 빌딩 이벤트를 조직하세요. 다음은 몇 가지 좋은 영상 추천입니다.
    *   [Getting Started With KMP: Build Apps for iOS and Android With Shared Logic and Native UIs](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu)
    *   [Build Apps for iOS, Android, and Desktop With Compose Multiplatform](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97)
    *   [iOS Development With Kotlin Multiplatform: Tips and Tricks](https://www.youtube.com/watch?v=eFzy1BRtHps)
    *   [Kotlin Multiplatform for Teams by Kevin Galligan](https://www.youtube.com/watch?v=-tJvCOfJesk)

현실적으로 하루나 일주일 만에 사람들의 마음을 바꾸지는 못할 것입니다. 하지만 동료들의 필요에 대한 인내심과 세심함은 의심할 여지 없이 좋은 결과를 가져올 것입니다.

JetBrains 팀은 [Kotlin Multiplatform 경험에 대한 당신의 이야기](mailto:kotlin.multiplatform.feedback@kotlinlang.org)를 듣기를 기대합니다.

_이 글 작성에 도움을 주신 [Touchlab 팀](https://touchlab.co)에게 감사드립니다._