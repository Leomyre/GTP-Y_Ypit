import type React from "react"
import infoTour from "@/utils/InfoTour"

interface InfoTourProps {
  field?: "name" | "nif" | "stat"
}

const InfoTour: React.FC<InfoTourProps> = ({ field }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {infoTour.map((tour, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="flex-shrink-0">
            <tour.icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="flex-grow">
            {field ? (
              <p className="font-semibold text-gray-800 dark:text-gray-200">{tour[field]}</p>
            ) : (
              <>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{tour.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  NIF: <span className="font-medium">{tour.nif}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  STAT: <span className="font-medium">{tour.stat}</span>
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default InfoTour

