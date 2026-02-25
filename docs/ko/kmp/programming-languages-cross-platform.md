# 크로스 플랫폼 애플리케이션 개발을 위한 인기 프로그래밍 언어

<web-summary>크로스 플랫폼 개발을 위한 언어 선택 시 주요 고려 사항, 인기 기술 비교 및 실제 사례 연구를 살펴봅니다.</web-summary>

최근 [크로스 플랫폼 개발(cross-platform development)](cross-platform-mobile-development.md)이라는 용어가 점점 더 자주 등장하고 있다는 사실을 느끼셨을 것입니다. 실제로 소프트웨어 개발 분야에서 크로스 플랫폼 프로그래밍은 점점 더 인기를 얻고 있습니다. 특히 모바일 앱 분야에서 매우 널리 퍼져 있지만, 그 용도가 모바일 애플리케이션에만 국한되는 것은 결코 아닙니다. 기업들이 여러 기기와 운영 체제에서 더 넓은 고객층에게 다가가기 위해 노력함에 따라, 개발자들은 플랫폼 간의 장벽을 허무는 다재다능한 언어와 프레임워크로 눈을 돌리고 있습니다.

크로스 플랫폼 개발을 시작하는 데 어떤 프로그래밍 언어가 가장 적합할지 고민 중이라면, 이 개요 문서가 통찰력 있는 정보와 실제 사용 사례 예시를 통해 올바른 방향을 제시해 줄 것입니다.

## 크로스 플랫폼 개발의 이해

크로스 플랫폼 애플리케이션 개발이란 단일 코드베이스를 사용하여 iOS, Android, Windows, macOS, 웹 브라우저 등 여러 플랫폼에서 실행되는 소프트웨어를 만드는 개발 방식을 의미합니다. 이 방식은 최근 몇 년 동안 모바일 앱에 대한 수요가 급증하면서 큰 인기를 얻었습니다. 모바일 엔지니어는 각 플랫폼용 애플리케이션을 따로 개발하는 대신 iOS와 Android 간에 소스 코드의 일부 또는 전부를 공유할 수 있습니다.

[네이티브 및 크로스 플랫폼 개발](native-and-cross-platform.md)의 장단점과 두 방식 중 하나를 선택하는 방법에 대해 더 자세히 읽어볼 수 있는 전용 가이드가 마련되어 있습니다. 크로스 플랫폼 개발의 주요 장점은 다음과 같습니다.

1.  **비용 효율성:** 각 플랫폼마다 별도의 앱을 구축하는 것은 시간과 리소스 측면에서 비용이 많이 들 수 있습니다. 크로스 플랫폼 개발을 사용하면 개발자가 코드를 한 번 작성하여 여러 플랫폼에 배포할 수 있으므로 개발 비용이 절감됩니다.
2.  **빠른 개발 속도:** 이 방식은 개발자가 단일 코드베이스만 작성하고 유지 관리하면 되므로 개발 프로세스를 가속화하는 데 도움이 됩니다.
3.  **효율적이고 유연한 코드 공유:** 현대적인 크로스 플랫폼 기술을 통해 개발자는 네이티브 프로그래밍의 장점을 유지하면서 여러 플랫폼에서 코드를 재사용할 수 있습니다.
4.  **플랫폼 간 일관된 사용자 경험:** 크로스 플랫폼 개발을 사용하면 계산이나 워크플로와 같은 핵심 동작이 필요한 경우 서로 다른 플랫폼에서도 동일한 결과를 제공할 수 있습니다. 이는 일관성을 유지하는 데 도움이 되어 사용자가 iOS, Android 또는 기타 기기와 운영 체제 중 무엇을 사용하든 동일한 경험을 제공합니다.

이 문서에서는 크로스 플랫폼 개발을 위한 가장 인기 있는 프로그래밍 언어 몇 가지를 살펴보겠습니다.

## 인기 있는 크로스 플랫폼 프로그래밍 언어, 프레임워크 및 기술

이 문서에서는 크로스 플랫폼 개발에 적합한 잘 알려진 프로그래밍 언어에 초점을 맞춥니다. 다양한 용도로 설계된 언어가 많지만, 이 섹션에서는 관련 통계 및 이를 지원하는 프레임워크와 함께 크로스 플랫폼 개발을 위한 가장 인기 있는 프로그래밍 언어 몇 가지를 간략하게 소개합니다.

<table style="header-row">
    
<tr>
<td>언어</td>
        <td>최초 등장</td>
        <td>가장 인기 있는 기술 (<a href="https://survey.stackoverflow.co/2024/technology#most-popular-technologies">Stack Overflow, 2024</a>)</td>
        <td>가장 인기 있는 기술 (<a href="https://www.jetbrains.com/lp/devecosystem-2024/">Developer Ecosystem Report 2024</a>)</td>
        <td>생태계/도구</td>
        <td>기술/프레임워크</td>
</tr>

    
<tr>
<td>JavaScript</td>
        <td>1995년</td>
        <td>1위 (62.3%)</td>
        <td>1위 (61%)</td>
        <td>풍부한 생태계, 많은 라이브러리, 활발한 커뮤니티</td>
        <td>React Native, Ionic</td>
</tr>

    
<tr>
<td>Dart</td>
        <td>2011년</td>
        <td>17위 (6%)</td>
        <td>15위 (8%)</td>
        <td>성장 중인 생태계, Google의 지원</td>
        <td>Flutter</td>
</tr>

    
<tr>
<td>Kotlin</td>
        <td>2011년</td>
        <td>15위 (9.04%)</td>
        <td>13위 (14%)</td>
        <td>확장 중인 생태계, JetBrains 도구에 대한 최상급 지원</td>
        <td>Kotlin Multiplatform</td>
</tr>

    
<tr>
<td>C#</td>
        <td>2000년</td>
        <td>8위 (27.1%)</td>
        <td>9위 (22%)</td>
        <td>Microsoft의 강력한 지원, 거대한 생태계</td>
        <td>.NET MAUI</td>
</tr>

    
<tr>
<td>C++</td>
        <td>1985년</td>
        <td>9위 (23%)</td>
        <td>8위 (25%)</td>
        <td>성숙하지만 다른 언어에 비해 서드파티 라이브러리가 적음</td>
        <td>Qt</td>
</tr>

</table>

**JavaScript**

JavaScript는 사용자가 웹 페이지에서 복잡한 기능을 구현할 수 있도록 널리 사용되는 프로그래밍 언어입니다. React Native 및 Ionic과 같은 프레임워크의 도입으로 크로스 플랫폼 앱 개발을 위한 인기 있는 선택지가 되었습니다. JetBrains가 실시한 최신 [Developer Ecosystem Survey](https://www.jetbrains.com/lp/devecosystem-2024/)에 따르면 개발자의 61%가 JavaScript를 사용하고 있으며, 이는 가장 인기 있는 프로그래밍 언어입니다.

**Dart**

Dart는 2011년 Google에서 도입한 객체 지향 클래스 기반 프로그래밍 언어입니다. Dart는 단일 코드베이스에서 멀티플랫폼 애플리케이션을 구축하기 위해 Google에서 만든 오픈 소스 프레임워크인 Flutter의 기반이 됩니다. Dart는 Flutter 앱을 구동하는 언어와 런타임을 제공합니다.

**Kotlin**

Kotlin은 JetBrains에서 개발한 현대적이고 성숙한 멀티플랫폼 프로그래밍 언어입니다. [Octoverse 보고서](https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages)에 따르면 2024년에 다섯 번째로 빠르게 성장하는 언어입니다. 간결하고 안전하며 Java 및 기타 언어와 상호 운용이 가능하며, Google이 권장하는 Android 앱 개발용 언어이기도 합니다.

[Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)은 네이티브 프로그래밍의 이점을 유지하면서 다양한 플랫폼용 애플리케이션을 만들고 플랫폼 간에 Kotlin 코드를 재사용할 수 있게 해주는 JetBrains의 기술입니다. 또한 JetBrains는 KMP와 Jetpack Compose를 기반으로 여러 플랫폼에서 UI를 공유하기 위한 선언적 프레임워크인 Compose Multiplatform을 제공합니다. 2024년 5월, Google은 Android와 iOS 간에 비즈니스 로직을 공유하기 위한 [Kotlin Multiplatform에 대한 공식 지원](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)을 발표했습니다.

[![Discover Kotlin Multiplatform](discover-kmp.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)

**C#**

C#은 Microsoft에서 개발한 크로스 플랫폼 범용 프로그래밍 언어입니다. C#은 .NET Framework에서 가장 인기 있는 언어입니다. .NET MAUI는 Android, iOS, Mac 및 Windows용 단일 C# 코드베이스에서 네이티브 크로스 플랫폼 데스크톱 및 모바일 앱을 구축하기 위한 프레임워크입니다.

**C++**

C++은 1985년 C 프로그래밍 언어의 확장으로 처음 출시된 범용 프로그래밍 언어입니다. Qt는 모듈화된 C++ 라이브러리 클래스 세트를 포함하고 애플리케이션 개발을 위한 다양한 API를 제공하는 크로스 플랫폼 소프트웨어 개발 프레임워크입니다. Qt는 C++ 개발을 위한 애플리케이션 빌딩 블록과 함께 C++ 클래스 라이브러리를 제공합니다.

## 크로스 플랫폼 프로그래밍 언어 선택 시 주요 요인

오늘날 사용 가능한 모든 언어, 기술 및 도구를 고려할 때, 특히 크로스 플랫폼 개발의 세계에 막 발을 들여놓은 경우 적절한 것을 선택하는 것이 벅찰 수 있습니다. 다양한 크로스 플랫폼 기술에는 고유한 장단점이 있지만, 궁극적으로는 구축하려는 소프트웨어의 목표와 요구 사항에 따라 결정됩니다.

프로젝트를 위한 언어나 프레임워크를 선택할 때는 몇 가지 중요한 요소를 염두에 두어야 합니다. 여기에는 애플리케이션 유형, 성능 및 UX 요구 사항, 관련 도구 및 아래에 자세히 설명된 기타 다양한 고려 사항이 포함됩니다.

**1. 애플리케이션 유형**

프로그래밍 언어와 프레임워크마다 Windows, macOS, Linux, iOS, Android 및 웹 브라우저와 같은 다양한 플랫폼에서 지원되는 정도가 다릅니다. 특정 언어는 본질적으로 특정 플랫폼 및 프로젝트에 더 적합합니다.

**2. 성능 및 UX 요구 사항**

특정 유형의 애플리케이션은 속도, 응답성, 메모리 사용량, 중앙 처리 장치(CPU) 및 그래픽 처리 장치(GPU) 소비량과 같은 다양한 기준으로 측정할 수 있는 특정 성능 및 사용자 경험(UX) 요구 사항을 가집니다. 미래의 애플리케이션이 수행해야 할 기능과 위 기준에 대해 원하는 매개변수를 고려하세요.

> 예를 들어, 그래픽 집약적인 게임 앱은 GPU를 효율적으로 활용할 수 있는 언어로부터 이점을 얻을 수 있습니다. 반면, 비즈니스 앱은 데이터베이스 통합 및 네트워크 통신의 용이성을 우선시할 수 있습니다.
>
{style="tip"}

**3. 기존 기술 수준 및 학습 곡선**

다음 프로젝트를 위한 기술을 선택할 때 개발 팀은 이전 경험을 고려해야 합니다. 새로운 언어나 도구를 도입하려면 교육 시간이 필요하며, 이는 때때로 프로젝트를 지연시킬 수 있습니다. 학습 곡선이 가파를수록 팀이 숙련되는 데 더 오랜 시간이 걸립니다.

> 예를 들어, 팀이 숙련된 JavaScript 개발자로 구성되어 있고 새로운 기술을 채택할 리소스가 부족하다면 React Native와 같이 JavaScript를 활용하는 프레임워크를 선택하는 것이 유리할 수 있습니다.
>
{style="tip"}

**4. 기존 사용 사례**

고려해야 할 또 다른 중요한 요소는 기술의 실제 활용 사례입니다. 특정 크로스 플랫폼 언어나 프레임워크를 성공적으로 구현한 기업의 사례 연구를 검토하면 이러한 기술이 실제 운영 환경에서 어떻게 작동하는지에 대한 귀중한 통찰력을 얻을 수 있습니다. 이는 특정 기술이 프로젝트 목표에 적합한지 평가하는 데 도움이 될 수 있습니다. 예를 들어, Kotlin Multiplatform을 활용하여 다양한 플랫폼에서 운영 환경에 바로 적용 가능한 애플리케이션을 개발하는 기업들의 사례 연구를 살펴볼 수 있습니다.

![Kotlin Multiplatform Case Studies](kmp-case-studies.png){width="700"}

[![Explore Real-World Kotlin Multiplatform Use Cases](kmp-use-cases-1.svg){width="500" style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

**5. 언어 생태계**

또 다른 중요한 요소는 언어 생태계의 성숙도입니다. 멀티플랫폼 개발을 지원하는 도구와 라이브러리의 가용성 및 품질에 주의를 기울이세요. 예를 들어, JavaScript는 프런트엔드 프레임워크(React, Angular, Vue.js), 백엔드 개발(Express, NestJS) 및 기타 광범위한 기능을 지원하는 방대한 수의 라이브러리를 보유하고 있습니다.

마찬가지로 Flutter는 패키지 또는 플러그인이라고도 불리는 상당하고 빠르게 성장하는 라이브러리 수를 보유하고 있습니다. Kotlin Multiplatform은 현재 라이브러리 수가 더 적지만, 그 생태계는 빠르게 성장하고 있으며 전 세계의 많은 Kotlin 개발자에 의해 언어가 향상되고 있습니다. 아래 인포그래픽은 지난 몇 년 동안 Kotlin Multiplatform 라이브러리 수가 어떻게 증가했는지 보여줍니다.

![Kotlin Multiplatform Libraries Over Years](kmp-libs-over-years.png){width="700"}

**6. 인기 및 커뮤니티 지원**

프로그래밍 언어 및 관련 기술의 인기와 커뮤니티 지원을 면밀히 살펴볼 가치가 있습니다. 이는 단순히 사용자 및 라이브러리 수에 국한되지 않습니다. 사용자 및 기여자를 포함하여 해당 언어의 커뮤니티가 얼마나 활발하고 협조적인지 주의를 기울이세요. 이용 가능한 블로그, 팟캐스트, 포럼 및 기타 리소스를 찾아보세요.

## 크로스 플랫폼 개발의 미래

크로스 플랫폼 개발이 계속 발전함에 따라 이를 지원하는 도구와 언어에서 더욱 뛰어난 효율성, 성능 및 유연성을 기대할 수 있습니다. 여러 기기에서 원활한 사용자 경험에 대한 수요가 증가함에 따라 더 많은 기업이 네이티브 성능을 유지하면서 개발자가 코드를 공유할 수 있도록 하는 프레임워크에 투자하고 있습니다. 크로스 플랫폼 기술의 미래는 유망해 보이며, 제약을 줄이고 광범위한 애플리케이션에 대한 개발 프로세스를 더욱 간소화하는 방향으로 발전할 가능성이 높습니다.

[![See Kotlin Multiplatform in Action](see-kmp-in-action.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)