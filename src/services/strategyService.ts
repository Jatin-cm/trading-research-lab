import { Strategy, StrategyStatus } from '@/types'
import { mockStrategies } from './mockData'

/**
 * Service abstraction for Strategy operations.
 * Allows seamless migration from local mock data to backend REST/GraphQL/WebSocket API.
 */
class StrategyService {
  private strategies: Strategy[] = [...mockStrategies]

  async getAll(): Promise<Strategy[]> {
    return Promise.resolve([...this.strategies])
  }

  async getById(id: string): Promise<Strategy | undefined> {
    return Promise.resolve(this.strategies.find((s) => s.id === id))
  }

  async getByStatus(status: StrategyStatus): Promise<Strategy[]> {
    return Promise.resolve(this.strategies.filter((s) => s.status === status))
  }

  async create(strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Strategy> {
    const newStrategy: Strategy = {
      ...strategy,
      id: `strat-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    this.strategies.unshift(newStrategy)
    return Promise.resolve(newStrategy)
  }
}

export const strategyService = new StrategyService()

