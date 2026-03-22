# 功能

代理功能提供了一种扩展和增强 AI 代理功能的方法。
通过功能，您可以：

- 为代理添加新能力
- 拦截并修改代理行为
- 记录并监视代理执行
- 在单个功能中为同一事件类型注册多个处理程序

Koog 框架提供以下开箱即用的功能：

<div class="grid cards" markdown>

-   :material-flash:{ .lg .middle } [事件处理](agent-event-handlers.md)

    ---

    在代理执行期间监视并响应特定事件

-   :material-routes:{ .lg .middle } [跟踪](tracing.md)

    ---

    捕获有关代理运行的详细信息

-   :material-message-text-clock:{ .lg .middle } [聊天内存](chat-memory/index.md)

    ---

    在代理运行之间存储和检索聊天消息历史记录

-   :material-chip:{ .lg .middle } [代理内存](agent-memory.md)

    ---

    在代理运行期间及运行之间存储、检索和使用任意数据

-   :material-database-clock:{ .lg .middle } [长期内存](long-term-memory.md)

    ---

    为 AI 代理添加持久化内存

-   :material-content-save-cog:{ .lg .middle } [代理持久化](agent-persistence.md)

    ---

    在执行过程中的特定点保存和恢复代理的状态

-   :simple-opentelemetry:{ .lg .middle } [OpenTelemetry](open-telemetry/index.md)

    ---

    从您的代理生成、收集并导出遥测数据（跟踪）

</div>

要了解如何实现您自己的功能，请参阅[自定义功能](custom-features.md)。