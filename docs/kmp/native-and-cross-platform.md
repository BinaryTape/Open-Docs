<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="native-and-cross-platform"
       title="跨平台与原生应用开发：你该如何选择？">
<web-summary>了解何时选择原生或跨平台开发。查看 Kotlin Multiplatform 如何将共享逻辑与原生性能相结合。</web-summary>
    <p>2025–2026 年的移动应用开发由不断提高的用户预期、多平台需求以及对高性能体验的追求所定义。用户期望应用运行速度快、响应及时，并且能够与他们的设备无缝集成，无论他们使用的是 iOS 还是 Android。</p>
    <p>这对团队来说是一个至关重要的决定：是应该投资于原生应用开发，还是采用跨平台移动应用开发来同时为多个平台构建应用？选择正确的方法将直接影响性能、开发速度和长期维护。</p>
    <p>在本指南中，我们将分析原生、跨平台和混合开发之间的区别，并帮助您为项目选择最佳方法。</p>
    <chapter title="原生、跨平台和混合应用开发：关键区别"
             id="native-cross-platform-and-hybrid-app-development-key-differences">
        <p>在选择开发方法之前，了解原生、跨平台和混合应用在架构、性能和开发过程方面的差异非常重要。</p>
        <p>
            <b>原生应用开发：</b>
            原生应用是专门为单一平台（如 iOS 或 Android）构建的，使用平台特定的语言和工具，如 Swift、Objective-C、Kotlin 或 Java。这种方法可以提供最高水平的性能、对设备硬件的完整访问权限，以及与操作系统完全集成的用户体验。
        </p>
        <p>
            <b>跨平台应用开发：</b>
            <a href="cross-platform-mobile-development.topic">跨平台开发</a>允许团队使用单一代码库为多个平台构建应用程序。现代框架，如 <a
                href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform (KMP)</a>、Flutter 和 React Native，使开发者能够跨 iOS 和 Android 复用业务逻辑。这种方法加快了开发速度并简化了维护，同时仍能提供接近原生的性能。
        </p>
        <p><a href="https://kotlinlang.org/multiplatform/"><img src="discover-kmp.svg"
                                                                alt="探索 Kotlin Multiplatform" width="600"/></a>
        </p>
        <p>
            <b>混合应用开发：</b>
            混合应用本质上是使用 HTML、CSS 和 JavaScript 构建的 Web 应用程序，包装在原生容器中。虽然这种方法的实现速度快且具有成本效益，但它通常在性能、响应能力和访问设备功能方面存在局限性。
        </p>
        <p>最终的选择取决于您的优先级：是看重性能、更短的上市时间，还是团队内的专业知识。</p>
    </chapter>
    <chapter title="开发方法比较" id="comparing-development-approaches">
        <p>在原生、跨平台和混合开发之间做出选择，归根结底取决于每种方法如何平衡性能、开发速度和长期维护。</p>
        <chapter title="原生开发" id="native-development">
            <p>原生应用是使用平台特定的语言和 SDK 构建的，例如用于 iOS 的 Swift 或用于 Android 的 Kotlin 和 Java。它们提供对硬件功能的完整访问权限，使其成为性能密集型应用程序（如游戏、AR/VR 体验或具有复杂图形的应用）的理想选择。</p>
            <p>它们提供流畅且响应及时的用户体验、强大的离线功能以及与平台指南的高度一致，这可以提高应用在在线市场上的可见度。然而，原生开发需要为每个平台维护独立的代码库，从而增加了开发和维护成本。</p>
        </chapter>
        <chapter title="跨平台开发" id="cross-platform-development">
            <p>跨平台开发允许团队在多个平台之间共享大部分代码，通常在 60% 到 95% 之间。目前市面上有各种开源的跨平台移动应用开发框架。Kotlin Multiplatform、Flutter 和 React Native 等工具允许开发者在复用代码的同时，保持实现上的灵活性。</p>
            <p>这种方法减少了构建和维护独立代码库的需求，可以显著加快开发速度并降低总体成本。团队可以更快地交付功能、复用现有逻辑并跨平台同步应用更新，这使得跨平台开发对于具有复杂业务需求的产品尤其有效。</p>
            <p>现代框架还使平衡代码共享与平台特定自定义变得更加容易。在跨平台一致性更重要的情况下，开发者可以共享核心逻辑，同时保持原生感的用户界面，或者根据需要复用单个 UI 组件。</p>
            <p>尽管如此，权衡仍然存在。根据框架的不同，访问平台特定的 API 或实现高度专业化的功能可能需要额外的努力。性能通常接近原生，但在涉及密集图形或实时处理的边缘情况下可能会有所不同。</p>
            <note>
                <p>了解跨平台技术（如 <a href="use-cases-examples.md">Kotlin Multiplatform）如何在不同行业和团队结构中应用于生产环境</a>。</p>
            </note>
        </chapter>
        <chapter title="混合开发" id="hybrid-development">
            <p>混合应用在原生外壳中使用 Web 技术，使其构建起来最简单、最快捷。它们适用于简单的应用程序、原型或内部工具。</p>
            <p>然而，混合应用通常缺乏响应能力，并且在性能以及与设备功能的深度集成方面存在困难，这使得它们不太适合生产级消费类应用程序。</p>
        </chapter>
    </chapter>
    <chapter title="何时应选择原生应用开发？" id="when-should-you-choose-native-app-development">
        <p>在一些特定的情况下，选择原生移动开发是有意义的。在以下情况下，您应该考虑原生开发：</p>
        <list>
            <li>
                <p>
                    <b>您的目标是单一平台。</b>
                    如果您的产品仅专注于 iOS 或 Android，采用原生构建可以简化开发，并允许您针对该生态系统进行全面优化。
                </p>
            </li>
            <li>
                <p>
                    <b>您的应用是硬件密集型的。</b>
                    严重依赖设备功能的应用程序（如摄像头处理、GPS、传感器或实时交互）受益于对平台 API 的完整访问权限。这包括增强现实 (AR)、游戏和视频处理等用例。
                </p>
            </li>
            <li>
                <p>
                    <b>用户界面对您的应用程序至关重要。</b>
                    如果您的产品依赖于交付高度精致、平台特定的界面，原生开发允许您充分利用平台设计模式和 UI 能力。然而，即使在这种情况下，您也不必完全放弃代码共享，因为 Kotlin Multiplatform 等现代多平台解决方案允许您跨平台共享业务逻辑，同时保持 UI 完全原生。
                </p>
            </li>
            <li>
                <p>
                    <b>您依赖平台特定功能或频繁的操作系统更新。</b>
                    如果您的应用需要快速采用 iOS 或 Android 的新功能，原生开发允许您集成更新，而无需等待第三方框架的支持。
                </p>
            </li>
        </list>
        <note>
            <p>注意：您可以在我们的文档中详细了解 <a href="https://kotlinlang.org/docs/android-overview.html">Android 版 Kotlin</a>。</p>
        </note>
    </chapter>
    <chapter title="何时应选择跨平台应用开发？"
             id="when-should-you-choose-cross-platform-app-development">
        <p>当您需要高效地跨多个平台交付应用程序并保持共享代码库时，跨平台应用开发是一个强有力的选择。</p>
        <p>您应该在以下情况下考虑这种方法：</p>
        <list>
            <li>
                <p>
                    <b>您的目标同时包括 iOS 和 Android。</b>
                    如果您的产品需要覆盖多个平台的用户，跨平台开发让您可以构建和维护单一代码库，而不是管理独立的应用程序。
                </p>
            </li>
            <li>
                <p>
                    <b>上市时间至关重要。</b>
                    跨平台共享代码可以减少开发工作量并加快交付。这使得发布新功能更快，并能快速响应用户反馈。
                </p>
            </li>
            <li>
                <p>
                    <b>您希望优化开发和维护成本。</b>
                    通过共享代码库，团队可以减少重复劳动并简化长期维护，这对于初创公司和成长中的产品尤为重要。
                </p>
            </li>
            <li>
                <p>
                    <b>您的应用程序具有复杂的业务逻辑。</b>
                    当您的许多应用逻辑（如网络、数据处理或领域逻辑）可以跨平台复用时，跨平台解决方案特别有效。
                </p>
            </li>
            <li>
                <p>
                    <b>您希望平衡代码共享与原生能力。</b>
                    并非所有跨平台方法都是相同的。例如，Kotlin Multiplatform 允许您共享业务逻辑，同时保持 UI 原生，从而在不牺牲性能或用户体验的情况下为您提供灵活性。如果您还想跨平台共享 UI，<a
                        href="https://kotlinlang.org/compose-multiplatform/">Compose Multiplatform</a>（一个声明式框架）允许您复用 UI 代码，同时仍能通过单一代码库瞄准多个平台。
                </p>
            </li>
        </list>
        <p>跨平台开发在不断发展，现代工具持续减少传统上性能与生产力之间的权衡。</p>
        <note>
            <p>查看展示 Kotlin Multiplatform 强大且独特应用的项项目列表 → <a href="multiplatform-samples.md">Kotlin Multiplatform 示例</a>。</p>
        </note>
    </chapter>
    <chapter title="流行的跨平台框架" id="popular-cross-platform-frameworks">
        <p>目前有几种跨平台框架可供选择，每种框架在代码共享、性能和开发者体验方面都有自己的方法。正确的选择取决于您的项目要求和团队专业知识。</p>
        <list>
            <li>
                <p>
                    <b>Kotlin Multiplatform (KMP)</b>。
                    来自 JetBrains 的开源技术，允许开发者在 Android、iOS、桌面、Web 和服务器之间共享 Kotlin 代码，同时保留原生开发的优势。
                </p>
            </li>
            <li>
                <p>
                    <b>Flutter</b>。
                    由 Google 开发的开源框架，用于通过单一代码库构建原生编译的多平台应用程序。它以开发速度快和社区庞大而闻名。
                </p>
            </li>
            <li>
                <p>
                    <b>React Native</b>。
                    由 Meta 开发的开源框架，允许您使用 JavaScript 和 React 构建移动应用。它提供快速迭代和广泛的库及工具生态系统。
                </p>
            </li>
            <li>
                <p>
                    <b>.NET Multiplatform App UI (.NET MAUI)</b>。
                    适用于在 Microsoft 生态系统下工作的开发者的跨平台解决方案。该框架支持使用 C# 和 XAML 创建原生移动和桌面应用。
                </p>
            </li>
            <li>
                <p>
                    <b>Ionic</b>。
                    一个开源 UI 工具包，用于使用 Web 技术（HTML、CSS 和 JavaScript）构建跨平台移动应用，集成了 Angular、React 和 Vue 等框架，支持通过单一代码库进行开发。
                </p>
            </li>
        </list>
        <p>您可以在我们的文章中阅读更详细的流行 <a href="cross-platform-frameworks.topic">跨平台框架</a> 概述。</p>
    </chapter>
    <chapter title="Kotlin Multiplatform 如何弥合差距" id="how-kotlin-multiplatform-bridges-the-gap">
        <p>Kotlin Multiplatform 对跨平台开发采取了不同的方法，专注于共享有意义的内容，同时在关键领域保持完全控制。</p>
        <p>根据您的需求，您可以选择适合您项目的代码共享级别：</p>
        <list>
            <li>
                <p>
                    <b>共享逻辑和 UI。</b>
                    您可以将 Kotlin 与 Compose Multiplatform 结合使用，共享高达 100% 的应用代码（包括 UI），同时仍能与原生 API 集成。
                </p>
            </li>
            <li>
                <p>
                    <b>共享逻辑，保留原生 UI。</b>
                    共享数据和业务逻辑，同时在每个平台上保持完全原生的 UI —— 当平台特定行为和 UX 忠实度是首要任务时，这是理想的选择。
                </p>
            </li>
            <li>
                <p>
                    <b>共享一小部分逻辑。</b>
                    通过共享选定的组件（如验证、领域逻辑或身份验证）逐步开始，在不进行重大架构更改的情况下提高一致性。
                </p>
            </li>
        </list>
        <img src="with-compose-multiplatform.svg"
             alt="使用 Kotlin Multiplatform 和 Compose Multiplatform：开发者可以共享业务逻辑、表示逻辑，甚至 UI 逻辑"
             width="700"/>
        <p>除了平台特定的代码外，您几乎可以共享任何内容。</p>
        <p>团队在实践中取得的成果：</p>
        <p>
            <b>高度的代码复用与充分的灵活性。</b>
            团队通常可以共享高达 <b>90%–95% 的代码库</b>，在减少重复的同时，在必要时保留平台特定的实现。例如，<a
                href="https://kotlinlang.org/case-studies/#bitkey-by-block">Block 的 Bitkey 共享了 95%</a> 的移动代码库，使用了 Kotlin Multiplatform，确保了其开源比特币钱包的一致性。
        </p>
        <p>
            <b>更快的交付和迭代。</b>
            通过复用核心逻辑，团队可以缩短开发周期并更快地交付功能，通常报告 <b>发布时间表缩短了多达 30%</b>。使用 Kotlin 和 Compose Multiplatform，<a href="https://kotlinlang.org/case-studies/#music-work">Music Work 将开发和维护成本降低了 30%</a>，同时显著加快了他们的部署周期。
        </p>
        <p>
            <b>改善团队间的协作。</b>
            Android 和 iOS 开发者可以在共享代码库上工作，同时继续使用他们喜欢的工具和工作流程。例如，<a href="https://kotlinlang.org/case-studies/#prezzee">Prezzee 团队分享了他们的 Kotlin Multiplatform 历程</a>，在此过程中他们转变了移动开发方法，并建立了一个更强大、更具协作性的团队。
        </p>
        <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg"
                                                                                  alt="探索 Kotlin Multiplatform 用例"
                                                                                  width="600"/></a></p>
    </chapter>
    <chapter title="如何选择：实用决策指南" id="how-to-choose-a-practical-decision-guide">
        <p>在原生和跨平台开发之间做出选择取决于您的产品目标、技术要求和团队配置。请参考以下步骤来指导您的决策：</p>
        <p>
            <b>1. 定义您的目标平台</b>
        </p>
        <p>确定您的应用是在 Android、iOS 还是两者上运行。如果您从一开始就瞄准多个平台，跨平台开发可以帮助减少重复并简化维护。</p>
        <p>
            <b>2. 评估性能和功能要求</b>
        </p>
        <p>考虑您的应用程序在性能、图形和硬件访问方面的要求有多高。严重依赖设备能力（如实时处理、传感器或复杂动画）的应用可能会从原生方法中受益。</p>
        <p>
            <b>3. 评估团队的专业知识</b>
        </p>
        <p>考虑您的团队已经熟悉的编程语言和工具。原生开发通常需要平台特定的技能：开发者需要掌握 Objective-C 或 Swift 才能为 iOS 创建原生应用，而为 Android 开发则需要掌握 Kotlin 或 Java。另一方面，跨平台框架 Flutter 需要掌握 Dart。如果您使用 Kotlin Multiplatform，对于 iOS 开发者来说，Kotlin 语法很容易学习，因为它遵循与 Swift 相似的概念；对于 Android 开发者来说更是如此，因为它是现代 Android 应用的主要语言。借助 Kotlin Multiplatform，团队可以跨平台复用 Kotlin 技能，从而简化采用过程。</p>
        <p>
            <b>4. 平衡时间表、预算和维护</b>
        </p>
        <p>跨平台开发可以通过共享代码来减少开发时间和成本，而原生开发可能需要独立的实现。不仅要考虑初始开发工作，还要考虑长期维护和可扩展性。</p>
        <p>
            <b>5. 考虑长期可行性和生态系统</b>
        </p>
        <p>查看技术的成熟度、社区支持以及可用的学习资源。一个拥有积极开发和文档记录的强大生态系统有助于确保长期稳定性和更快的解决问题。您可以查看我们精选的 <a href="kmp-learning-resources.md">Kotlin Multiplatform (KMP) 和 Compose Multiplatform 学习资料</a> 列表。</p>
        <p>
            <b>6. 使您的架构面向未来</b>
        </p>
        <p>选择一种在产品演进过程中具有灵活性的方法。像 Kotlin Multiplatform 这样的解决方案让您可以从小规模开始，只共享部分代码，并逐步扩展，帮助您在无需重大重写的情况下适应不断变化的需求。</p>
    </chapter>
    <chapter title="常见问题解答" id="frequently-asked-question">
        <p>
            <b>问：什么是跨平台移动应用开发？</b>
        </p>
        <p>答：跨平台移动应用开发是使用单一代码库构建可在多个平台（如 Android 和 iOS）上运行的应用程序的过程。开发者可以跨平台复用部分代码，从而减少开发时间和维护工作。</p>
        <p>
            <b>问：原生和跨平台哪个更好？</b>
        </p>
        <p>答：没有万能的答案。原生开发提供最佳性能和对平台功能的完整访问，而跨平台开发通过代码共享实现更快的交付和更低的维护成本。正确的选择取决于您的项目要求、时间表和团队专业知识。</p>
        <p>
            <b>问：原生应用有哪些优势？</b>
        </p>
        <p>答：原生应用提供高性能、流畅且响应及时的交互，以及对设备硬件和平台 API 的完整访问。它们还遵循平台特定的设计指南，从而带来更一致且直观的用户体验。</p>
        <p>
            <b>问：跨平台应用使用哪些框架？</b>
        </p>
        <p>答：流行的跨平台框架包括 Kotlin Multiplatform、Flutter、React Native、.NET MAUI（前身为 Xamarin）和 Ionic。每个框架在代码共享、性能和访问原生功能之间提供了不同的平衡。</p>
        <p>
            <b>问：平台之间可以共享多少代码？</b>
        </p>
        <p>答：共享代码的数量取决于所使用的方法和工具。借助现代跨平台解决方案，团队通常可以共享 60%–95% 的代码，尤其是在涉及业务逻辑和数据处理时。某些方法还允许共享 UI 代码，从而进一步提高复用率。</p>
    </chapter>
    <chapter title="总结 – 做出正确选择" id="summary-making-the-right-choice">
        <p>在原生和跨平台开发之间做出选择归结为您的优先级。原生开发提供最佳性能、对设备功能的完整访问以及与平台指南一致的用户体验。跨平台开发侧重于效率，通过代码共享实现更快的交付、更低的成本和更简单的维护。</p>
        <p>Kotlin 和 Compose Multiplatform 共同提供了一种跨平台共享代码的灵活方式 —— 从业务逻辑到 UI —— 同时保留对原生 API 的访问，帮助您平衡性能、一致性和开发效率。</p>
        <p><a href="get-started.topic"><img src="kmp-journey-start.svg" alt="开启您的 KMP 之旅"
                                            width="600"/></a></p>
    </chapter>
</topic>